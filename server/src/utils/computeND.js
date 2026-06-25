import { timeToMinutes } from "./timeHelpers.js";

export const computeND = (punchIn, punchOut) => {
  const ND_START = timeToMinutes("22:00");
  const ND_END = timeToMinutes("06:00");
  const MIDNIGHT = 24 * 60;

  const punchInMin = timeToMinutes(punchIn);
  const punchOutMin = timeToMinutes(punchOut);

  const crossesMidnight = punchOutMin < punchInMin;

  let ndMinutes = 0;

  if (crossesMidnight) {
    if (punchInMin < MIDNIGHT) {
      const segStart = Math.max(punchInMin, ND_START);
      const segEnd = MIDNIGHT;
      if (segEnd > segStart) ndMinutes += segEnd - segStart;
    }

    if (punchOutMin > 0) {
      const segStart = 0;
      const segEnd = Math.min(punchOutMin, ND_END);
      if (segEnd > segStart) ndMinutes += segEnd - segStart;
    }
  } else {
    if (punchOutMin > ND_START) {
      const segStart = Math.max(punchInMin, ND_START);
      const segEnd = punchOutMin;
      if (segEnd > segStart) ndMinutes += segEnd - segStart;
    }

    if (punchInMin < ND_END) {
      const segStart = punchInMin;
      const segEnd = Math.min(punchOutMin, ND_END);
      if (segEnd > segStart) ndMinutes += segEnd - segStart;
    }
  }

  return ndMinutes > 0 ? ndMinutes : 0;
};
