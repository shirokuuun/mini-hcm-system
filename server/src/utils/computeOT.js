import { timeToMinutes } from "./timeHelpers.js";

// Computes Overtime Minutes

export const computeOT = (punchOut, shiftEnd) => {
  const punchOutMinutes = timeToMinutes(punchOut);
  const shiftEndMinutes = timeToMinutes(shiftEnd);

  const ot = punchOutMinutes - shiftEndMinutes;
  return ot > 0 ? ot : 0;
};
