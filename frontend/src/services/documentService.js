// Serviço de comunicação com a API de documentos do backend.

const API_BASE = '/api';

export async function fetchDocuments() {
  const response = await fetch(`${API_BASE}/documents`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar os documentos');
  }

  return response.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Não foi possível enviar o documento');
  }

  return response.json();
}

export function getDownloadUrl(id) {
  return `${API_BASE}/documents/${id}/download`;
}
