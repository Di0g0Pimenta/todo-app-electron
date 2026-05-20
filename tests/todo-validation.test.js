const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeDate, normalizeTodoInput } = require("../electron/shared/todo-validation");

test("normalizeTodoInput trims valid todo data", () => {
  assert.deepEqual(
    normalizeTodoInput({
      name: "  Estudar Electron  ",
      notes: "  IPC + SQLite  ",
      dueDate: "2026-05-20"
    }),
    {
      name: "Estudar Electron",
      notes: "IPC + SQLite",
      dueDate: "2026-05-20"
    }
  );
});

test("normalizeTodoInput rejects empty names", () => {
  assert.throws(() => normalizeTodoInput({ name: "   " }), /nome da tarefa/i);
});

test("normalizeDate accepts empty dates as null", () => {
  assert.equal(normalizeDate(""), null);
  assert.equal(normalizeDate(null), null);
});

test("normalizeDate rejects invalid formats", () => {
  assert.throws(() => normalizeDate("20-05-2026"), /YYYY-MM-DD/);
});
