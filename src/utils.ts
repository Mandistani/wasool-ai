import { Transaction, AnalyticsSummary } from "./types";

/**
 * Returns today's date string in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a number into a beautiful currency string
 */
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `Rs. ${formatted}`;
};

/**
 * Formats a date string (YYYY-MM-DD) into a friendly display format
 */
export const formatDateFriendly = (dateStr: string): string => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr + "T00:00:00");
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStr = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${monthStr} ${year}`;
  } catch (e) {
    return dateStr;
  }
};

/**
 * Iterates through transactions and updates status to "overdue" if pending and past its due date.
 */
export const updateTransactionStatuses = (transactions: Transaction[]): Transaction[] => {
  const todayStr = getTodayDateString();

  return transactions.map((t) => {
    if (t.status !== "paid") {
      // If due date has passed, it's overdue
      if (t.dueDate && t.dueDate < todayStr) {
        return { ...t, status: "overdue" };
      } else {
        return { ...t, status: "pending" };
      }
    }
    return t;
  });
};

/**
 * Calculates financial analytics based on the transaction array
 */
export const calculateAnalytics = (transactions: Transaction[]): AnalyticsSummary => {
  let totalLent = 0;
  let totalBorrowed = 0;
  let totalRecovered = 0;
  let totalRepaid = 0;
  let pendingAmount = 0;
  let overdueAmount = 0;
  let activeDebtsCount = 0;

  transactions.forEach((t) => {
    const isLent = t.type !== "borrowed";
    
    if (isLent) {
      totalLent += t.amount;
      if (t.status === "paid") {
        totalRecovered += t.amount;
      } else {
        activeDebtsCount++;
        if (t.status === "overdue") {
          overdueAmount += t.amount;
        } else {
          pendingAmount += t.amount;
        }
      }
    } else {
      totalBorrowed += t.amount;
      if (t.status === "paid") {
        totalRepaid += t.amount;
      } else {
        activeDebtsCount++;
        if (t.status === "overdue") {
          overdueAmount += t.amount;
        } else {
          pendingAmount += t.amount;
        }
      }
    }
  });

  return {
    totalLent,
    totalBorrowed,
    totalRecovered,
    totalRepaid,
    pendingAmount,
    overdueAmount,
    activeDebtsCount,
  };
};

/**
 * Generates initial mock/starter data if user wants to see how the app works (optional, but let's keep it pristine and empty or provide 1 nice starter debt if requested, otherwise Empty State rules first).
 */
export const getStarterTransactions = (): Transaction[] => {
  return []; // Start completely empty for a pristine first-time user experience as requested!
};
