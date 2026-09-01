// Configuração centralizada do diretório de armazenamento local de arquivos.

const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

function ensureStorageDir() {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

module.exports = {
  STORAGE_DIR,
  ensureStorageDir,
};
