const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getTodos: () => ipcRenderer.invoke("todos:getAll"),
  addTodo: (data) => ipcRenderer.invoke("todos:add", data),
  updateTodo: (id, data) => ipcRenderer.invoke("todos:update", id, data),
  toggleTodo: (id, done) => ipcRenderer.invoke("todos:toggle", id, done),
  deleteTodo: (id) => ipcRenderer.invoke("todos:delete", id)
});
