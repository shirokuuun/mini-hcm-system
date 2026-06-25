import { computeOT } from "./src/utils/computeOT.js";
import { computeND } from "./src/utils/computeND.js";
import { minutesToReadable } from "./src/utils/timeHelpers.js";
import { computeDailySummary } from "./src/services/computeService.js";

console.log("=== UTILS ===");
console.log(
  "OT (19:30, shift 18:00):",
  minutesToReadable(computeOT("19:30", "18:00")),
);
console.log(
  "ND (22:00–23:00):",
  minutesToReadable(computeND("22:00", "23:00")),
);
console.log(
  "ND (22:00–06:00):",
  minutesToReadable(computeND("22:00", "06:00")),
);
console.log(
  "ND (09:00–18:00):",
  minutesToReadable(computeND("09:00", "18:00")),
);

console.log("\n=== COMPUTE SERVICE ===");

const case1 = computeDailySummary({
  punchIn: "09:00",
  punchOut: "18:00",
  schedule: { start: "09:00", end: "18:00" },
});
console.log("Case 1 (on time, no OT):", case1);

const case2 = computeDailySummary({
  punchIn: "09:30",
  punchOut: "19:00",
  schedule: { start: "09:00", end: "18:00" },
});
console.log("Case 2 (late 30m, OT 1h):", case2);

const case3 = computeDailySummary({
  punchIn: "09:00",
  punchOut: "16:00",
  schedule: { start: "09:00", end: "18:00" },
});
console.log("Case 3 (undertime 2h):", case3);

const case4 = computeDailySummary({
  punchIn: "22:00",
  punchOut: "06:00",
  schedule: { start: "22:00", end: "06:00" },
});
console.log("Case 4 (full night shift):", case4);
