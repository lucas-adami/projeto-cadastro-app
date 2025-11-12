const fs = require("fs");
const path = require("path");

// Caminhos dos arquivos
const packageJsonPath = path.resolve(__dirname, "../package.json");
const appJsonPath = path.resolve(__dirname, "../app.json");

// Lê os arquivos
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

// Atualiza a versão no app.json
appJson.expo = appJson.expo || {};
appJson.expo.version = packageJson.version;

// Salva o app.json atualizado
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), "utf8");