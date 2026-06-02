const { addTodo, toggleTodo, closeDatabase, getAllTodos, deleteTodo, initDatabase, getDbPath } = require("../electron/database");

const today = new Date();

function dateKey(offset) {
  const date = new Date(today);
  date.setDate(today.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeKey(minutesOffset = 0) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesOffset);
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${mins}`;
}

initDatabase();

// Limpar tarefas existentes para um reset completo
const existing = getAllTodos();
for (const todo of existing) {
    deleteTodo(todo.id);
}

const demoTodos = [
  // Tarefas para HOJE
  {
    name: "Reuniao de Projeto (Hoje)",
    notes: "Apresentacao do prototipo Electron + Angular para a equipa. Discutir arquitetura e proximos passos.\n- Mostrar calendário\n- Explicar SQLite\n- Demonstrar notificacoes",
    dueDate: dateKey(0),
    reminderTime: timeKey(2), // Lembrar daqui a 2 minutos para testar notificacoes do Electron
    done: false
  },
  {
    name: "Comprar cafe",
    notes: "Ir a maquina buscar cafe antes da reuniao.",
    dueDate: dateKey(0),
    reminderTime: null,
    done: true // Ja concluida
  },
  {
    name: "Ligar ao cliente",
    notes: "Confirmar requisitos do novo modulo de notificacoes.",
    dueDate: dateKey(0),
    reminderTime: timeKey(60), // Daqui a uma hora
    done: false
  },
  {
    name: "Responder a emails urgentes",
    notes: "",
    dueDate: dateKey(0),
    reminderTime: null,
    done: false
  },

  // Tarefas PASSADAS (Atrasadas)
  {
    name: "Pagar fatura da internet",
    notes: "Aviso de corte em breve! Pagar via homebanking.",
    dueDate: dateKey(-2),
    reminderTime: "10:00",
    done: false
  },
  {
    name: "Rever pull requests",
    notes: "Rever o codigo do modulo de IPC.",
    dueDate: dateKey(-1),
    reminderTime: null,
    done: true
  },

  // Tarefas FUTURAS
  {
    name: "Entregar relatorio mensal",
    notes: "O relatorio deve incluir estatisticas de uso, bugs resolvidos e novas funcionalidades planeadas para o proximo trimestre. Nao esquecer de incluir graficos detalhados.",
    dueDate: dateKey(1),
    reminderTime: "17:00",
    done: false
  },
  {
    name: "Jantar com amigos",
    notes: "Restaurante no centro da cidade. Mesa reservada para as 20h.",
    dueDate: dateKey(3),
    reminderTime: "19:30",
    done: false
  },
  {
    name: "Consulta de rotina",
    notes: "Levar exames anteriores e cartao do seguro.",
    dueDate: dateKey(10),
    reminderTime: "08:00",
    done: false
  },

  // Tarefas SEM DATA
  {
    name: "Ler livro sobre TypeScript",
    notes: "Comecar a ler o capitulo sobre decorators e metadados.",
    dueDate: null,
    reminderTime: null,
    done: false
  },
  {
    name: "Comprar teclado novo",
    notes: "Procurar teclados mecanicos silenciosos para usar no escritorio.",
    dueDate: null,
    reminderTime: null,
    done: false
  },
  {
    name: "Aprender Rust",
    notes: "Ver tutorial basico no fim de semana.",
    dueDate: null,
    reminderTime: null,
    done: true
  }
];

let createdCount = 0;

for (const todo of demoTodos) {
  const added = addTodo({
    name: todo.name,
    notes: todo.notes,
    dueDate: todo.dueDate,
    reminderTime: todo.reminderTime
  });
  
  if (todo.done) {
    toggleTodo(added.id, true);
  }
  createdCount += 1;
}

console.log(`Base de dados: ${getDbPath()}`);
console.log(`${createdCount} tarefa(s) demo adicionadas com sucesso! (Base de dados limpa e recriada)`);
closeDatabase();
