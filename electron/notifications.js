const fs = require("fs");
const path = require("path");
const { getDataDir } = require("./constants");

const DEFAULT_CHECK_INTERVAL_MS = 60 * 1000;

function getNotificationStatePath() {
  return path.join(getDataDir(), "notification-state.json");
}

function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateTimeKey(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${toDateKey(date)}T${hours}:${minutes}`;
}

function getTodoReminderKey(todo) {
  return `${todo.dueDate}T${todo.reminderTime || "00:00"}`;
}

function getNotificationKey(todo) {
  return `${todo.id}:${getTodoReminderKey(todo)}`;
}

function getDuePendingTodos(todos, now = new Date()) {
  const nowKey = toDateTimeKey(now);
  return todos
    .filter((todo) => !todo.done && todo.dueDate && getTodoReminderKey(todo) <= nowKey)
    .sort((left, right) => {
      const dateOrder = getTodoReminderKey(left).localeCompare(getTodoReminderKey(right));
      return dateOrder === 0 ? left.id - right.id : dateOrder;
    });
}

function readNotificationState(filePath = getNotificationStatePath()) {
  try {
    const state = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return {
      notifiedKeys: Array.isArray(state.notifiedKeys) ? state.notifiedKeys : []
    };
  } catch (_error) {
    return { notifiedKeys: [] };
  }
}

function writeNotificationState(state, filePath = getNotificationStatePath()) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
}

function filterUnnotifiedTodos(todos, state, now = new Date()) {
  const notifiedKeys = new Set(state.notifiedKeys || []);
  return getDuePendingTodos(todos, now).filter((todo) => !notifiedKeys.has(getNotificationKey(todo)));
}

function buildNotificationContent(todos, todayKey = toDateKey()) {
  if (todos.length === 1) {
    const [todo] = todos;
    const title = todo.dueDate < todayKey ? "Tarefa em atraso" : "Tarefa para hoje";
    return {
      title,
      body: [todo.name, todo.reminderTime ? `Hora: ${todo.reminderTime}` : "", todo.notes || ""]
        .filter(Boolean)
        .join("\n")
    };
  }

  const overdueCount = todos.filter((todo) => todo.dueDate < todayKey).length;
  const preview = todos
    .slice(0, 4)
    .map((todo) => `- ${todo.reminderTime ? `${todo.reminderTime} ` : ""}${todo.name}`)
    .join("\n");
  const remaining = todos.length > 4 ? `\n+ ${todos.length - 4} tarefa(s)` : "";

  return {
    title: overdueCount
      ? `${todos.length} tarefas pendentes (${overdueCount} em atraso)`
      : `${todos.length} tarefas para hoje`,
    body: `${preview}${remaining}`
  };
}

async function notifyDueTodos({
  database,
  Notification,
  mainWindow,
  stateFilePath = getNotificationStatePath(),
  now = new Date()
}) {
  if (!Notification?.isSupported?.()) {
    return 0;
  }

  const state = readNotificationState(stateFilePath);
  const todos = filterUnnotifiedTodos(database.getAllTodos(), state, now);

  if (!todos.length) {
    return 0;
  }

  const todayKey = toDateKey(now);
  const notification = new Notification(buildNotificationContent(todos, todayKey));
  notification.on("click", () => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.focus();
  });
  notification.show();

  const notifiedKeys = new Set(state.notifiedKeys || []);
  for (const todo of todos) {
    notifiedKeys.add(getNotificationKey(todo));
  }

  writeNotificationState({ notifiedKeys: [...notifiedKeys] }, stateFilePath);
  return todos.length;
}

function startTaskNotifications({
  database,
  mainWindow,
  checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS,
  stateFilePath = getNotificationStatePath()
}) {
  const { Notification } = require("electron");

  const check = () => {
    notifyDueTodos({ database, Notification, mainWindow, stateFilePath }).catch((error) => {
      console.error("[notifications]", error);
    });
  };

  setTimeout(check, 5000);
  const timer = setInterval(check, checkIntervalMs);
  return () => clearInterval(timer);
}

module.exports = {
  buildNotificationContent,
  filterUnnotifiedTodos,
  getDuePendingTodos,
  getNotificationKey,
  getNotificationStatePath,
  getTodoReminderKey,
  notifyDueTodos,
  readNotificationState,
  startTaskNotifications,
  toDateKey,
  toDateTimeKey,
  writeNotificationState
};
