// Regras de negócio relacionadas a documentos.
// Orquestra repositórios de dados (documentos) e filesystem, sem duplicação ou lógica de I/O.

const documentRepository = require('../repositories/documentRepository');
const fileRepository = require('../repositories/fileRepository');

function registerUpload({ originalName, storedName, size, owner }) {
  // Valida dados fornecidos pelo controller (após validação HTTP).
  if (!originalName || !storedName) {
    throw new Error('Arquivo inválido para upload');
  }

  return documentRepository.create({ originalName, storedName, size, owner });
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocumentForDownload(id) {
  // Busca documento no repositório de dados.
  const document = documentRepository.findById(id);

  if (!document) {
    return null;
  }

  // Valida existência do arquivo no filesystem (sem duplicar lógica de caminho).
  if (!fileRepository.fileExists(document.storedName)) {
    return null;
  }

  return { document, filePath: fileRepository.buildFilePath(document.storedName) };
}

module.exports = {
  registerUpload,
  listDocuments,
  getDocumentForDownload,
};
