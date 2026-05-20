const path = require("path");
const { app, BrowserWindow } = require("electron");
const { initDatabase, closeDatabase } = require("./database");
const { registerTodoHandlers } = require("./ipc");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 940,
    minHeight: 680,
    backgroundColor: "#f8fafc",
    title: "ToDo Calendar",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "todo-calendar-electron", "browser", "index.html"));
}

app.whenReady().then(() => {
  initDatabase();
  registerTodoHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  closeDatabase();
});
