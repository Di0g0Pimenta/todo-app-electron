function normalizeDate(value) {
  if (!value) return null;

  const cleanValue = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  return cleanValue;
}

function normalizeTodoInput(data) {
  const name = String(data?.name || "").trim();

  if (!name) {
    throw new Error("O nome da tarefa e obrigatorio.");
  }

  return {
    name,
    notes: String(data?.notes || "").trim(),
    dueDate: normalizeDate(data?.dueDate)
  };
}

function normalizeTodoUpdate(currentTodo, data) {
  const input = normalizeTodoInput({
    name: data?.name ?? currentTodo.name,
    notes: data?.notes ?? currentTodo.notes,
    dueDate: data?.dueDate === undefined ? currentTodo.dueDate : data.dueDate
  });

  return {
    ...input,
    done: data?.done === undefined ? Boolean(currentTodo.done) : Boolean(data.done)
  };
}

module.exports = {
  normalizeDate,
  normalizeTodoInput,
  normalizeTodoUpdate
};
