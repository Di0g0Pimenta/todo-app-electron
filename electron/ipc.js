const { ipcMain } = require("electron");
const database = require("./database");

let handlersRegistered = false;

function registerHandler(channel, callback) {
  // Cada handler traduz um pedido do renderer numa chamada segura ao backend.
  ipcMain.handle(channel, async (_event, ...args) => {
    try {
      return await callback(...args);
    } catch (error) {
      console.error(`[IPC:${channel}]`, error);
      throw new Error(error instanceof Error ? error.message : "Erro inesperado na aplicacao.");
    }
  });
}

function registerTodoHandlers() {
  if (handlersRegistered) return;
  handlersRegistered = true;

  // Estes nomes de canais sao o contrato entre preload.js e database.js.
  registerHandler("todos:getAll", () => database.getAllTodos());
  registerHandler("todos:add", (data) => database.addTodo(data));
  registerHandler("todos:update", (id, data) => database.updateTodo(id, data));
  registerHandler("todos:toggle", (id, done) => database.toggleTodo(id, done));
  registerHandler("todos:delete", (id) => database.deleteTodo(id));
}

module.exports = {
  registerTodoHandlers
};
