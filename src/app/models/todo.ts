export interface Todo {
  id: number;
  name: string;
  notes: string;
  done: boolean;
  dueDate: string | null;
  reminderTime: string | null;
}

export interface TodoInput {
  name: string;
  notes: string;
  dueDate: string | null;
  reminderTime: string | null;
}
