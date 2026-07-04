/**
 * Normalizes a backend naive date-time string (UTC) and parses it into a JavaScript Date object.
 * If the date-time string lacks timezone specifiers, it appends "Z" to prevent local offset shifts.
 */
export const parseBackendDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  try {
    let normalized = dateStr;
    if (!dateStr.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(dateStr)) {
      normalized = dateStr + "Z";
    }
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Formats an ISO date-time string into a human-friendly local format (e.g. "4 Jul 2026, 6:35 PM").
 */
export const formatDisplayDate = (dateStr: string | null | undefined): string => {
  const date = parseBackendDate(dateStr);
  if (!date) return "Never";

  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};
