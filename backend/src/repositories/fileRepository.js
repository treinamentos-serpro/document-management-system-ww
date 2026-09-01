// Repositório de acesso a arquivos no filesystem local.
//
// Encapsula todas as operações de I/O de arquivo, separando a responsabilidade
// de persistência do filesystem da camada de serviço (regras de negócio).

const fs = require('fs');
const path = require('path');
const { STORAGE_DIR } = require('../config/storage');

function buildFilePath(storedFileName) {
  return path.join(STORAGE_DIR, storedFileName);
}

function fileExists(storedFileName) {
  const filePath = buildFilePath(storedFileName);
  return fs.existsSync(filePath);
}

module.exports = {
  buildFilePath,
  fileExists,
};
