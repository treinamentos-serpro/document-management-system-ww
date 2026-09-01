// Controller responsável por tratar entrada/saída HTTP dos documentos.

const documentService = require('../services/documentService');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ mensagem: 'Nenhum arquivo enviado' });
  }

  try {
    const document = documentService.registerUpload({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      owner: req.body.owner || 'anonimo',
    });

    return res.status(201).json(document);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

function list(req, res) {
  const documents = documentService.listDocuments();
  return res.json(documents);
}

function download(req, res) {
  const result = documentService.getDocumentForDownload(req.params.id);

  if (!result) {
    return res.status(404).json({ mensagem: 'Documento não encontrado' });
  }

  return res.download(result.filePath, result.document.originalName);
}

module.exports = {
  upload,
  list,
  download,
};
