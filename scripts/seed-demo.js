const { addTodo, closeDatabase, getAllTodos, initDatabase, getDbPath } = require("../electron/database");

const today = new Date();

function dateKey(offset) {
  const date = new Date(today);
  date.setDate(today.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const demoTodos = [
  {
    name: "Preparar apresentacao",
    notes: "Explicar main process, preload, IPC e SQLite.",
    dueDate: dateKey(0)
  },
  {
    name: "Rever componentes Angular",
    notes: "CalendarComponent, TaskListComponent e TaskModalComponent.",
    dueDate: dateKey(1)
  },
  {
    name: "Testar criacao de tarefas",
    notes: "Criar, concluir e eliminar uma tarefa durante a demonstracao.",
    dueDate: dateKey(2)
  },
  {
    name: "Ideias para proximas funcionalidades",
    notes: "Filtros, edicao, prioridades e notificacoes.",
    dueDate: null
  }
];

initDatabase();

const existingNames = new Set(getAllTodos().map((todo) => todo.name));
let createdCount = 0;

for (const todo of demoTodos) {
  if (!existingNames.has(todo.name)) {
    addTodo(todo);
    createdCount += 1;
  }
}

console.log(`Base de dados: ${getDbPath()}`);
console.log(`${createdCount} tarefa(s) demo adicionada(s).`);
closeDatabase();
