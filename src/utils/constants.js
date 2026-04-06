export const AMBER   = "#f59e0b";
export const AMBER_D = "#d97706";

export const CATEGORY_CONFIG = {
  Food:     { color: "#f97316", emoji: "🍔" },
  Travel:   { color: "#3b82f6", emoji: "✈️" },
  Bills:    { color: "#8b5cf6", emoji: "📱" },
  Salary:   { color: "#10b981", emoji: "💼" },
  Shopping: { color: "#ec4899", emoji: "🛍️" },
  Other:    { color: "#f59e0b", emoji: "📦" },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export const SEED_DATA = [
  { id: 1,  date: "2024-01-05", category: "Salary",   amount: 35000, type: "income",  note: "January salary" },
  { id: 2,  date: "2024-01-10", category: "Food",     amount: 3200,  type: "expense", note: "Groceries" },
  { id: 3,  date: "2024-01-15", category: "Travel",   amount: 1800,  type: "expense", note: "Cab rides" },
  { id: 4,  date: "2024-01-20", category: "Bills",    amount: 2500,  type: "expense", note: "Electricity" },
  { id: 5,  date: "2024-01-25", category: "Shopping", amount: 4200,  type: "expense", note: "New clothes" },
  { id: 6,  date: "2024-02-05", category: "Salary",   amount: 35000, type: "income",  note: "February salary" },
  { id: 7,  date: "2024-02-08", category: "Food",     amount: 2800,  type: "expense", note: "Restaurants" },
  { id: 8,  date: "2024-02-14", category: "Shopping", amount: 3500,  type: "expense", note: "Valentine gifts" },
  { id: 9,  date: "2024-02-20", category: "Bills",    amount: 2200,  type: "expense", note: "Internet + phone" },
  { id: 10, date: "2024-02-28", category: "Other",    amount: 5000,  type: "income",  note: "Freelance project" },
  { id: 11, date: "2024-03-05", category: "Salary",   amount: 35000, type: "income",  note: "March salary" },
  { id: 12, date: "2024-03-08", category: "Food",     amount: 4200,  type: "expense", note: "Dining out" },
  { id: 13, date: "2024-03-12", category: "Travel",   amount: 8500,  type: "expense", note: "Weekend trip" },
  { id: 14, date: "2024-03-18", category: "Bills",    amount: 2300,  type: "expense", note: "Utilities" },
  { id: 15, date: "2024-03-25", category: "Shopping", amount: 1200,  type: "expense", note: "Books" },
  { id: 16, date: "2024-03-30", category: "Other",    amount: 3000,  type: "income",  note: "Quarterly bonus" },
];
