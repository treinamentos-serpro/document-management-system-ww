const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

// Testes de integração dos endpoints de documentos (upload, listagem e
// download), usando o app Express diretamente sem subir um servidor HTTP.

function request(app, { method, path: reqPath, headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const http = require('http');

      const req = http.request(
        { hostname: '127.0.0.1', port, path: reqPath, method, headers },
        (res) => {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            server.close();
            resolve({ status: res.statusCode, body: Buffer.concat(chunks) });
          });
        }
      );

      req.on('error', (error) => {
        server.close();
        reject(error);
      });

      if (body) req.write(body);
      req.end();
    });
  });
}

test('upload, listagem e download de documentos', async () => {
  const boundary = '----testBoundary';
  const fileContent = 'conteudo de teste';
  const payload =
    `--${boundary}\r\n` +
    'Content-Disposition: form-data; name="file"; filename="teste.txt"\r\n' +
    'Content-Type: text/plain\r\n\r\n' +
    `${fileContent}\r\n` +
    `--${boundary}--\r\n`;

  const uploadResponse = await request(app, {
    method: 'POST',
    path: '/upload',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(payload),
    },
    body: payload,
  });

  assert.strictEqual(uploadResponse.status, 201);
  const uploaded = JSON.parse(uploadResponse.body.toString());
  assert.strictEqual(uploaded.originalName, 'teste.txt');

  const listResponse = await request(app, { method: 'GET', path: '/documents' });
  assert.strictEqual(listResponse.status, 200);
  const documents = JSON.parse(listResponse.body.toString());
  assert.ok(documents.some((document) => document.id === uploaded.id));

  const downloadResponse = await request(app, {
    method: 'GET',
    path: `/documents/${uploaded.id}/download`,
  });
  assert.strictEqual(downloadResponse.status, 200);
  assert.strictEqual(downloadResponse.body.toString(), fileContent);

  // Limpa o arquivo gerado durante o teste.
  const storedFilePath = path.join(__dirname, '..', 'storage', uploaded.storedName);
  fs.rmSync(storedFilePath, { force: true });
});

test('download de documento inexistente retorna 404', async () => {
  const response = await request(app, {
    method: 'GET',
    path: '/documents/id-inexistente/download',
  });

  assert.strictEqual(response.status, 404);
});
