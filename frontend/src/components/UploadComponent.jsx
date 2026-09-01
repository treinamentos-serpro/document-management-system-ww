// Componente responsável por selecionar e enviar um documento.

import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setErro('Selecione um arquivo antes de enviar');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      await uploadDocument(file);
      setFile(null);
      event.target.reset();
      onUploaded?.();
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
      <input
        type="file"
        onChange={(event) => setFile(event.target.files[0])}
        aria-label="Selecionar documento"
      />
      <button type="submit" disabled={enviando} style={{ marginLeft: '0.5rem' }}>
        {enviando ? 'Enviando...' : 'Enviar documento'}
      </button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </form>
  );
}
