import { useEffect, useState } from 'react';
import api from '../api.js';

export default function CADashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/documents/ca');
        setDocuments(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load documents.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = async (documentId) => {
    try {
      const response = await api.get(`/documents/download/${documentId}`);
      window.open(response.data.downloadUrl, '_blank');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create download link.');
    }
  };

  return (
    <div className="page ca-page">
      <div className="card">
        <h1>CA Officer Dashboard</h1>
        <p>View documents sent for review, download files, and verify customer details.</p>
      </div>

      <div className="card documents-panel">
        {loading ? (
          <p>Loading documents…</p>
        ) : error ? (
          <div className="toast error">{error}</div>
        ) : documents.length ? (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Customer Code</th>
                <th>Status</th>
                <th>Uploaded At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.user_name} ({doc.user_email})</td>
                  <td>{doc.customer_code}</td>
                  <td>{doc.sent_to_ca ? 'Sent to CA' : 'Uploaded'}</td>
                  <td>{new Date(doc.created_at).toLocaleString()}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => handleDownload(doc.id)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents available for CA review.</p>
        )}
      </div>
    </div>
  );
}
