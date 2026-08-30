export function formatDateRange(start: string, end: string): string {
  return `${formatMonthYear(start)} — ${formatMonthYear(end)}`;
}

export function formatMonthYear(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
