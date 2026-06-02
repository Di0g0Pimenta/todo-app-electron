const path = require("path");

const DB_FILE_NAME = "todos.db";
const DATA_DIR = path.join(__dirname, "..", "data");

function getDataDir() {
  if (process.env.TODO_DATA_DIR) {
    return process.env.TODO_DATA_DIR;
  }

  if (process.versions.electron) {
    const { app } = require("electron");
    if (app && app.isPackaged) {
      return app.getPath("userData");
    }
  }

  return DATA_DIR;
}

function getDbPath() {
  return process.env.TODO_DB_PATH || path.join(getDataDir(), DB_FILE_NAME);
}

module.exports = {
  DATA_DIR,
  DB_FILE_NAME,
  getDataDir,
  getDbPath
};
