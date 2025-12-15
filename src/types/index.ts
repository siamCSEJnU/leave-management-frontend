export type User = {
  id?: number;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "employee" | "manager" | "admin";
  department?: string | null;
  manager_id?: string | null;
  leave_balance: number;
  is_active: boolean;
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
