const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Format number as Indian Rupee string */
export const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/** Return YYYY-MM key from a date string */
export const monthKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

/** Return 3-letter month label from a YYYY-MM key */
export const monthLabel = (k) => {
  const [, m] = k.split("-");
  return MONTH_NAMES[parseInt(m) - 1] || k;
};

/** Return today's date as YYYY-MM-DD */
export const todayStr = () => new Date().toISOString().slice(0, 10);
