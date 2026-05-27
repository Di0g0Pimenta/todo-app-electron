const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeDate, normalizeTime, normalizeTodoInput } = require("../electron/shared/todo-validation");

test("normalizeTodoInput trims valid todo data", () => {
  assert.deepEqual(
    normalizeTodoInput({
      name: "  Estudar Electron  ",
      notes: "  IPC + SQLite  ",
      dueDate: "2026-05-20",
      reminderTime: " 09:30 "
    }),
    {
      name: "Estudar Electron",
      notes: "IPC + SQLite",
      dueDate: "2026-05-20",
      reminderTime: "09:30"
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

test("normalizeTime accepts valid times", () => {
  assert.equal(normalizeTime("08:05"), "08:05");
  assert.equal(normalizeTime(""), null);
});

test("normalizeTime rejects invalid times", () => {
  assert.throws(() => normalizeTime("24:00"), /00:00 e 23:59/);
  assert.throws(() => normalizeTime("8:00"), /HH:mm/);
});

test("normalizeTodoInput ignores reminder time without a due date", () => {
  assert.deepEqual(
    normalizeTodoInput({
      name: "Tarefa livre",
      notes: "",
      dueDate: null,
      reminderTime: "09:30"
    }),
    {
      name: "Tarefa livre",
      notes: "",
      dueDate: null,
      reminderTime: null
    }
  );
});
