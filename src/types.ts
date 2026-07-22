export interface Transaction {
  id: string;
  borrowerName: string;
  relationship: string;
  amount: number;
  lendingDate: string;
  dueDate: string;
  purpose: string;
  status: "pending" | "paid" | "overdue";
  additionalNotes: string;
  createdAt: string;
  type?: "lent" | "borrowed"; // "lent" is the default for backwards compatibility
}

export type ToneType = "super_friendly" | "polite_professional" | "soft_humorous" | "firm_direct";

export interface ReminderResponse {
  reminderText: string;
  advice: string;
}

export interface AnalyticsSummary {
  totalLent: number;
  totalBorrowed: number;
  totalRecovered: number;
  totalRepaid: number;
  pendingAmount: number;
  overdueAmount: number;
  activeDebtsCount: number;
}

