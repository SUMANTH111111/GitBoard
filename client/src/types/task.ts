export type Priority = "High" | "Medium" | "Low";

export type Status = "TODO" | "IN PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;

  due_date?: string;
  created_at?: string;

  sprint_id?: number;
}