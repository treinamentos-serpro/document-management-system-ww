// Componente raiz do Document Management System.

import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { fetchDocuments } from './services/documentService';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [erro, setErro] = useState('');

  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchDocuments();
      setDocuments(data);
      setErro('');
    } catch (error) {
      setErro(error.message);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploaded={loadDocuments} />
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <DocumentList documents={documents} />
    </main>
  );
}
