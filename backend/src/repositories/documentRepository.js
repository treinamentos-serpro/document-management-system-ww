// Repositório de documentos.
//
// Guarda os metadados dos documentos em memória (fase inicial do projeto).
// Os arquivos em si ficam no filesystem local, gerenciados pelo multer.

let documents = [];
let nextId = 1;

function create({ originalName, storedName, size, owner }) {
  const document = {
    id: String(nextId++),
    originalName,
    storedName,
    size,
    owner,
    createdAt: new Date().toISOString(),
  };

  documents.push(document);
  return document;
}

function findAll() {
  return documents;
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = {
  create,
  findAll,
  findById,
};
