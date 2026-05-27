const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildNotificationContent,
  filterUnnotifiedTodos,
  getDuePendingTodos,
  getNotificationKey,
  toDateKey,
  toDateTimeKey
} = require("../electron/notifications");

test("toDateKey formats local dates as YYYY-MM-DD", () => {
  assert.equal(toDateKey(new Date(2026, 4, 7)), "2026-05-07");
});

test("toDateTimeKey formats local dates and times", () => {
  assert.equal(toDateTimeKey(new Date(2026, 4, 7, 9, 5)), "2026-05-07T09:05");
});

test("getDuePendingTodos returns only unfinished todos with reached reminders", () => {
  const todos = [
    { id: 1, name: "Hoje sem hora", done: false, dueDate: "2026-05-27", reminderTime: null },
    { id: 2, name: "Mais tarde", done: false, dueDate: "2026-05-27", reminderTime: "18:00" },
    { id: 3, name: "Feita", done: true, dueDate: "2026-05-20", reminderTime: "09:00" },
    { id: 4, name: "Sem data", done: false, dueDate: null, reminderTime: "09:00" },
    { id: 5, name: "Atrasada", done: false, dueDate: "2026-05-20", reminderTime: "10:15" },
    { id: 6, name: "Agora", done: false, dueDate: "2026-05-27", reminderTime: "14:30" }
  ];

  assert.deepEqual(
    getDuePendingTodos(todos, new Date(2026, 4, 27, 14, 30)).map((todo) => todo.id),
    [5, 1, 6]
  );
});

test("filterUnnotifiedTodos skips todos already notified for the same reminder", () => {
  const todos = [
    { id: 1, name: "Hoje", done: false, dueDate: "2026-05-27", reminderTime: "09:00" },
    { id: 2, name: "Atrasada", done: false, dueDate: "2026-05-20", reminderTime: null }
  ];
  const state = {
    notifiedKeys: [getNotificationKey(todos[0])]
  };

  assert.deepEqual(
    filterUnnotifiedTodos(todos, state, new Date(2026, 4, 27, 10, 0)).map((todo) => todo.id),
    [2]
  );
});

test("buildNotificationContent creates a useful summary for multiple todos", () => {
  const content = buildNotificationContent(
    [
      { id: 1, name: "Pagar conta", done: false, dueDate: "2026-05-26", reminderTime: "09:00" },
      { id: 2, name: "Enviar relatorio", done: false, dueDate: "2026-05-27", reminderTime: "14:30" }
    ],
    "2026-05-27"
  );

  assert.match(content.title, /2 tarefas pendentes/);
  assert.match(content.body, /09:00 Pagar conta/);
  assert.match(content.body, /Enviar relatorio/);
});
