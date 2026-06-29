// e.g. "09:30" → 570

export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") {
    throw new Error(`timeToMinutes received invalid value: ${timeStr}`);
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// e.g. 570 → "9h 30m"

export const minutesToReadable = (minutes) => {
  if (minutes <= 0) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// e.g. 570 → 9.5

export const minutesToHours = (minutes) => {
  return Math.round((minutes / 60) * 100) / 100;
};

// e.g. minutesBetween("09:00", "18:00") → 540

export const minutesBetween = (startTime, endTime) => {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
};

// Extracts "HH:MM" from a Firestore Timestamp or JS Date
// e.g. Date object → "09:15"

export const extractTime = (timestamp) => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Gets today's date as YYYY-MM-DD

export const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  }); // returns "YYYY-MM-DD"
};
