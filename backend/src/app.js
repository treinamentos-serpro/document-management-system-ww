// Seed do servidor backend do Document Management System.
//
// Este arquivo é apenas um ponto de partida mínimo. Ao longo do workshop você
// vai usar o Agent Mode do GitHub Copilot para construir as camadas:
//   - routes/       (definição das rotas)
//   - controllers/  (entrada HTTP e validação)
//   - services/     (regras de negócio)
//   - repositories/ (persistência: arquivos locais + metadados em memória)
//
// Restrição do projeto: uploads são gravados no filesystem local da aplicação
// usando multer com diskStorage. Não utilize provedores externos..

const express = require('express');
const multer = require('multer');
const documentRoutes = require('./routes/documentRoutes');
const { ensureStorageDir } = require('./config/storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Garante que o diretório de storage existe antes de qualquer operação.
ensureStorageDir();

app.use(express.json());

// Endpoint de verificação de saúde.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(documentRoutes);

// Handler de erro centralizado: evita vazar detalhes internos ao cliente.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ mensagem: 'Falha no upload: ' + err.message });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ mensagem: err.message });
  }

  console.error(err);
  return res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
