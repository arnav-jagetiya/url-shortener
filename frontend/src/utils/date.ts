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
 * Formats an ISO date-time string into a human-readable display string.
 */
export const formatDisplayDate = (dateStr: string | null | undefined): string => {
  const date = parseBackendDate(dateStr);
  if (!date) return "Never";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
