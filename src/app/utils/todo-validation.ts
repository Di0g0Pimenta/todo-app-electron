import { TodoInput } from "../models/todo";

export function normalizeDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const cleanValue = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  return cleanValue;
}

export function normalizeTodoInput(data: TodoInput): TodoInput {
  const name = data.name.trim();

  if (!name) {
    throw new Error("O nome da tarefa e obrigatorio.");
  }

  return {
    name,
    notes: data.notes.trim(),
    dueDate: normalizeDate(data.dueDate)
  };
}
