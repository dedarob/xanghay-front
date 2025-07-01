const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  const indexPath = path.resolve(__dirname, "..", "dist", "index.html");
  console.log("Tentando carregar:", indexPath);
  win.loadFile(indexPath);

  win.on("closed", () => {
    console.log("Janela fechada, matando backend se estiver rodando...");
    if (backendProcess) {
      backendProcess.kill();
      backendProcess = null;
    }
  });
}

app.whenReady().then(() => {
  const jarPath = path.join(
    process.resourcesPath,
    "app.asar.unpacked",
    "electron",
    "backend",
    "casamarmorista-0.0.1-SNAPSHOT.jar"
  );

  // Caminho original do DB no asar.unpacked
  const originalDbPath = path.join(
    process.resourcesPath,
    "app.asar.unpacked",
    "electron",
    "backend",
    "persistence",
    "xanghaydata.db"
  );

  // Caminho do DB persistente no userData
  const persistentDbDir = path.join(app.getPath("userData"), "data");
  const persistentDbPath = path.join(persistentDbDir, "xanghaydata.db");

  // Garante que a pasta de destino existe
  if (!fs.existsSync(persistentDbDir)) {
    fs.mkdirSync(persistentDbDir, { recursive: true });
  }

  // Copia o DB só se ainda não estiver lá
  if (!fs.existsSync(persistentDbPath)) {
    fs.copyFileSync(originalDbPath, persistentDbPath);
    console.log("Banco de dados copiado para:", persistentDbPath);
  } else {
    console.log("Banco de dados já existe em:", persistentDbPath);
  }

  console.log(`Iniciando backend: java -jar ${jarPath}`);

  backendProcess = spawn("java", [
    "-jar",
    jarPath,
    `--spring.datasource.url=jdbc:sqlite:${persistentDbPath.replace(
      /\\/g,
      "/"
    )}`,
  ]);

  backendProcess.stdout.on("data", (data) => {
    console.log(`[BACKEND]: ${data.toString()}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`[BACKEND ERROR]: ${data.toString()}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`[BACKEND]: Processo saiu com código ${code}`);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
