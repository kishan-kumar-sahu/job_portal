export const initials = (name = "User") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
export const titleCase = (value = "") =>
  value.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
export const money = (salary) => {
  if (!salary || (!salary.min && !salary.max)) return "Salary not listed";
  const fmt = (n) => `${Math.round(Number(n) / 1000)}k`;
  return `₹${salary.min ? fmt(salary.min) : "—"}${salary.max ? `–${fmt(salary.max)}` : ""}`;
};
export const idOf = (obj) => obj?._id || obj?.id || "";
