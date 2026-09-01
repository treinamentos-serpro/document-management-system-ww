// Regras de negócio relacionadas a documentos.

const fs = require('fs');
const path = require('path');
const documentRepository = require('../repositories/documentRepository');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

function registerUpload({ originalName, storedName, size, owner }) {
  if (!originalName || !storedName) {
    throw new Error('Arquivo inválido para upload');
  }

  return documentRepository.create({ originalName, storedName, size, owner });
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocumentForDownload(id) {
  const document = documentRepository.findById(id);

  if (!document) {
    return null;
  }

  const filePath = path.join(STORAGE_DIR, document.storedName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return { document, filePath };
}

module.exports = {
  registerUpload,
  listDocuments,
  getDocumentForDownload,
};
