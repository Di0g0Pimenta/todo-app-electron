function normalizeDate(value) {
  if (!value) return null;

  const cleanValue = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  return cleanValue;
}

function normalizeTime(value) {
  if (!value) return null;

  const cleanValue = String(value).trim();
  if (!/^\d{2}:\d{2}$/.test(cleanValue)) {
    throw new Error("A hora deve estar no formato HH:mm.");
  }

  const [hours, minutes] = cleanValue.split(":").map(Number);
  if (hours > 23 || minutes > 59) {
    throw new Error("A hora deve estar entre 00:00 e 23:59.");
  }

  return cleanValue;
}

function normalizeTodoInput(data) {
  const name = String(data?.name || "").trim();
  const dueDate = normalizeDate(data?.dueDate);

  if (!name) {
    throw new Error("O nome da tarefa e obrigatorio.");
  }

  return {
    name,
    notes: String(data?.notes || "").trim(),
    dueDate,
    reminderTime: dueDate ? normalizeTime(data?.reminderTime) : null
  };
}

function normalizeTodoUpdate(currentTodo, data) {
  const input = normalizeTodoInput({
    name: data?.name ?? currentTodo.name,
    notes: data?.notes ?? currentTodo.notes,
    dueDate: data?.dueDate === undefined ? currentTodo.dueDate : data.dueDate,
    reminderTime: data?.reminderTime === undefined ? currentTodo.reminderTime : data.reminderTime
  });

  return {
    ...input,
    done: data?.done === undefined ? Boolean(currentTodo.done) : Boolean(data.done)
  };
}

module.exports = {
  normalizeDate,
  normalizeTime,
  normalizeTodoInput,
  normalizeTodoUpdate
};
