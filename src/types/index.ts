export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "employee" | "manager" | "admin";
  leave_balance: number;
};

export type Leave = {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewer_notes?: string;
  employee: { first_name: string; last_name: string };
};
