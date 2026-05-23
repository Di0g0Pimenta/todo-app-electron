const path = require("path");
const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const { initDatabase, closeDatabase } = require("./database");
const { registerTodoHandlers } = require("./ipc");

let mainWindow = null;
let tray = null;

// Impede que o app feche quando todas as janelas são fechadas (necessário para o tray)
app.on("window-all-closed", () => {
  // Não faz nada — a app fica viva no tray
});

function createTray() {
  const iconPath = path.join(__dirname, "tray-icon.png");
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip("ToDo Calendar");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Abrir Calendário",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: "separator" },
    {
      label: "Sair Definitivamente",
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Duplo clique no ícone do tray abre a janela
  tray.on("double-click", () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 940,
    minHeight: 680,
    backgroundColor: "#f8fafc",
    title: "ToDo Calendar",
    webPreferences: {
      // O preload e a unica ponte entre Angular e o processo main.
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Ao clicar no "X", esconde a janela em vez de fechar
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // O Angular e compilado para dist/ antes de o Electron abrir a janela.
  mainWindow.loadFile(path.join(__dirname, "..", "dist", "todo-calendar-electron", "browser", "index.html"));
}

app.whenReady().then(() => {
  // A base de dados e os canais IPC ficam prontos antes da interface carregar.
  initDatabase();
  registerTodoHandlers();
  createWindow();
  createTray();

  app.on("activate", () => {
    // macOS: reabrir janela ao clicar no dock
    mainWindow.show();
  });
});

app.on("before-quit", () => {
  // Permite fechar a janela de verdade ao sair pelo menu do tray
  mainWindow.removeAllListeners("close");
  closeDatabase();
});
