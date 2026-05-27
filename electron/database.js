const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { getDbPath } = require("./constants");
const { normalizeTodoInput, normalizeTodoUpdate } = require("./shared/todo-validation");

let db;

function mapTodo(row) {
  // A DB usa snake_case; a interface Angular recebe camelCase.
  return {
    id: row.id,
    name: row.name,
    notes: row.notes || "",
    done: Boolean(row.done),
    dueDate: row.due_date,
    reminderTime: row.reminder_time
  };
}

function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    db = new Database(dbPath);
    // WAL melhora a fiabilidade para escrita/leitura local no SQLite.
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }

  return db;
}

function initDatabase() {
  // A tabela e criada no arranque, por isso a app funciona numa pasta limpa.
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      notes     TEXT,
      done      INTEGER DEFAULT 0,
      due_date  TEXT,
      reminder_time TEXT
    )
  `);

  const columns = getDb().prepare("PRAGMA table_info(todos)").all().map((column) => column.name);
  if (!columns.includes("reminder_time")) {
    getDb().exec("ALTER TABLE todos ADD COLUMN reminder_time TEXT");
  }
}

function getAllTodos() {
  return getDb()
    .prepare(`
      SELECT id, name, notes, done, due_date, reminder_time
      FROM todos
      ORDER BY
        CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
        due_date ASC,
        CASE WHEN reminder_time IS NULL THEN 1 ELSE 0 END,
        reminder_time ASC,
        done ASC,
        id DESC
    `)
    .all()
    .map(mapTodo);
}

function addTodo(data) {
  const todo = normalizeTodoInput(data);

  const result = getDb()
    .prepare(`
      INSERT INTO todos (name, notes, due_date, reminder_time)
      VALUES (@name, @notes, @dueDate, @reminderTime)
    `)
    .run(todo);

  return getTodoById(result.lastInsertRowid);
}

function getTodoById(id) {
  const row = getDb()
    .prepare(`
      SELECT id, name, notes, done, due_date, reminder_time
      FROM todos
      WHERE id = ?
    `)
    .get(id);

  return row ? mapTodo(row) : null;
}

function updateTodo(id, data) {
  const todoId = Number(id);
  const currentTodo = getTodoById(todoId);

  if (!currentTodo) {
    throw new Error("Tarefa nao encontrada.");
  }

  const todo = normalizeTodoUpdate(currentTodo, data);

  getDb()
    .prepare(`
      UPDATE todos
      SET name = @name,
          notes = @notes,
          done = @done,
          due_date = @dueDate,
          reminder_time = @reminderTime
      WHERE id = @id
    `)
    .run({ id: todoId, ...todo, done: Number(todo.done) });

  return getTodoById(todoId);
}

function toggleTodo(id, done) {
  const todoId = Number(id);
  const currentTodo = getTodoById(todoId);

  if (!currentTodo) {
    throw new Error("Tarefa nao encontrada.");
  }

  getDb()
    .prepare("UPDATE todos SET done = ? WHERE id = ?")
    .run(Number(Boolean(done)), todoId);

  return getTodoById(todoId);
}

function deleteTodo(id) {
  const result = getDb()
    .prepare("DELETE FROM todos WHERE id = ?")
    .run(Number(id));

  return result.changes > 0;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  initDatabase,
  getDbPath,
  getAllTodos,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  closeDatabase
};
