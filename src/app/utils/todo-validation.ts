import { TodoInput } from "../models/todo";

export function normalizeDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const cleanValue = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  return cleanValue;
}

export function normalizeTime(value: string | null | undefined): string | null {
  if (!value) return null;

  const cleanValue = value.trim();
  if (!/^\d{2}:\d{2}$/.test(cleanValue)) {
    throw new Error("A hora deve estar no formato HH:mm.");
  }

  const [hours, minutes] = cleanValue.split(":").map(Number);
  if (hours > 23 || minutes > 59) {
    throw new Error("A hora deve estar entre 00:00 e 23:59.");
  }

  return cleanValue;
}

export function normalizeTodoInput(data: TodoInput): TodoInput {
  const name = data.name.trim();
  const dueDate = normalizeDate(data.dueDate);

  if (!name) {
    throw new Error("O nome da tarefa e obrigatorio.");
  }

  return {
    name,
    notes: data.notes.trim(),
    dueDate,
    reminderTime: dueDate ? normalizeTime(data.reminderTime) : null
  };
}
