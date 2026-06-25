import { computeOT } from "../utils/computeOT.js";
import { computeND } from "../utils/computeND.js";
import {
  timeToMinutes,
  minutesToHours,
  extractTime,
} from "../utils/timeHelpers.js";

export const computeDailySummary = ({ punchIn, punchOut, schedule }) => {
  const MIDNIGHT = 24 * 60;

  const shiftStartMin = timeToMinutes(schedule.start);
  const shiftEndMin = timeToMinutes(schedule.end);
  const punchInMin = timeToMinutes(punchIn);
  const punchOutMin = timeToMinutes(punchOut);

  const crossesMidnight = punchOutMin < punchInMin;
  const shiftCrossesMidnight = shiftEndMin < shiftStartMin;

  const effectivePunchOut = crossesMidnight
    ? punchOutMin + MIDNIGHT
    : punchOutMin;
  const effectiveShiftEnd = shiftCrossesMidnight
    ? shiftEndMin + MIDNIGHT
    : shiftEndMin;
  const scheduledMinutes = effectiveShiftEnd - shiftStartMin;

  const lateMinutes =
    punchInMin > shiftStartMin ? punchInMin - shiftStartMin : 0;

  const undertimeMinutes =
    effectivePunchOut < effectiveShiftEnd
      ? effectiveShiftEnd - effectivePunchOut
      : 0;

  const totalWorkedMinutes = effectivePunchOut - punchInMin;

  const regularMinutes = Math.min(totalWorkedMinutes, scheduledMinutes);

  const otMinutes = computeOT(punchOut, schedule.end);
  const ndMinutes = computeND(punchIn, punchOut);

  return {
    punchIn,
    punchOut,
    regularHours: minutesToHours(regularMinutes),
    overtimeHours: minutesToHours(otMinutes),
    nightDifferentialHours: minutesToHours(ndMinutes),
    lateMinutes,
    undertimeMinutes,
  };
};

export const computeFromFirestorePunches = (
  punchInDoc,
  punchOutDoc,
  schedule,
) => {
  const punchIn = extractTime(punchInDoc.timestamp);
  const punchOut = extractTime(punchOutDoc.timestamp);
  return computeDailySummary({ punchIn, punchOut, schedule });
};
