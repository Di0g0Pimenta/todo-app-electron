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
    dueDate: row.due_date
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
      due_date  TEXT
    )
  `);
}

function getAllTodos() {
  return getDb()
    .prepare(`
      SELECT id, name, notes, done, due_date
      FROM todos
      ORDER BY
        CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
        due_date ASC,
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
      INSERT INTO todos (name, notes, due_date)
      VALUES (@name, @notes, @dueDate)
    `)
    .run(todo);

  return getTodoById(result.lastInsertRowid);
}

function getTodoById(id) {
  const row = getDb()
    .prepare(`
      SELECT id, name, notes, done, due_date
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
          due_date = @dueDate
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
