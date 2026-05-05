import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

const initialDocumentState = {
  file: null,
  previewUrl: null,
  customerCode: '',
  validCode: false,
  codeMessage: '',
  sendToCA: false,
  uploadMessage: '',
  uploadError: ''
};

export default function Dashboard({ user }) {
  const [state, setState] = useState(initialDocumentState);
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const uploadSectionRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const customerCodeClass = useMemo(
    () => (state.validCode ? 'success' : state.codeMessage ? 'error' : ''),
    [state.validCode, state.codeMessage]
  );

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((doc) => {
      return (
        doc.customer_code.toLowerCase().includes(query) ||
        doc.dropbox_path.toLowerCase().includes(query) ||
        (doc.sent_to_ca ? 'sent to ca' : 'uploaded').includes(query)
      );
    });
  }, [documents, searchQuery]);

  const totalDocs = documents.length;
  const sentDocs = documents.filter((doc) => doc.sent_to_ca).length;
  const latestDoc = documents[0] || null;

  const handleQuickUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const response = await api.get('/documents/user');
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const validateCode = async (value) => {
    if (!value) {
      setState((prev) => ({ ...prev, validCode: false, codeMessage: 'Enter customer code' }));
      return;
    }

    try {
      const response = await api.get('/customer-codes/validate', { params: { code: value } });
      setState((prev) => ({
        ...prev,
        validCode: response.data.valid,
        codeMessage: response.data.message
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        validCode: false,
        codeMessage: error.response?.data?.message || 'Validation failed'
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const previewUrl = file ? URL.createObjectURL(file) : null;
    setState((prev) => ({ ...prev, file, previewUrl, uploadMessage: '', uploadError: '' }));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, uploadMessage: '', uploadError: '' }));

    if (!state.file || !state.customerCode || !state.validCode) {
      return setState((prev) => ({
        ...prev,
        uploadError: 'Choose a valid file and valid customer code before uploading.'
      }));
    }

    const formData = new FormData();
    formData.append('file', state.file);
    formData.append('customer_code', state.customerCode);
    formData.append('send_to_ca', state.sendToCA);

    setUploading(true);
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setState((prev) => ({
        ...prev,
        uploadMessage: response.data.message,
        uploadError: '',
        file: null,
        previewUrl: null
      }));
      fetchDocuments();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        uploadMessage: '',
        uploadError: error.response?.data?.error || 'Upload failed. Please try again.'
      }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-topbar">
        <div className="dashboard-welcome">
          <div className="brand-chip">GLASSVAULT</div>
          <h1>Welcome back, {user.name}</h1>
          <p>Modern document management with instant preview, smart search, and secure CA workflows.</p>
        </div>

        <div className="dashboard-actions">
          <div className="search-block">
            <label className="search-label">Smart Search</label>
            <div className="search-input-wrap">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search customer code, status, or file path"
              />
              <span className="search-accent" />
            </div>
          </div>

          <button className="btn-primary quick-upload" type="button" onClick={handleQuickUpload}>
            + Quick Upload
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="glass-card sidebar-panel">
            <div className="sidebar-heading">
              <span className="sidebar-icon">✨</span>
              <div>
                <h3>Action Center</h3>
                <p>Sample codes, live status, and workflow shortcuts.</p>
              </div>
            </div>
            <div className="sidebar-metrics">
              <div>
                <span>{totalDocs}</span>
                <p>Files tracked</p>
              </div>
              <div>
                <span>{sentDocs}</span>
                <p>Sent to CA</p>
              </div>
            </div>
          </div>

          <div className="glass-card sidebar-panel sample-data">
            <h4>Sample customer data</h4>
            <ul>
              <li><strong>CUST1001</strong> • Active</li>
              <li><strong>CUST1002</strong> • Active</li>
              <li><strong>CUST1003</strong> • Pending</li>
              <li><strong>CUST1004</strong> • Review</li>
            </ul>
          </div>

          <div className="glass-card sidebar-panel preview-summary">
            <h4>Latest upload</h4>
            {latestDoc ? (
              <>
                <p>{latestDoc.customer_code}</p>
                <small>{new Date(latestDoc.created_at).toLocaleString()}</small>
                <div className={`status-pill ${latestDoc.sent_to_ca ? 'sent' : 'uploaded'}`}>
                  {latestDoc.sent_to_ca ? 'Sent to CA' : 'Uploaded'}
                </div>
              </>
            ) : (
              <p>No uploads yet. Use Quick Upload to start.</p>
            )}
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="glass-card upload-card" ref={uploadSectionRef}>
            <div className="panel-title-wrap">
              <h2>Upload Document</h2>
              {user.role === 'admin' || user.role === 'ca_officer' ? (
                <Link className="btn-secondary" to="/ca">CA Review</Link>
              ) : null}
            </div>
            <form className="upload-form" onSubmit={handleUpload}>
              <label className="field-label">
                File
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} />
              </label>

              <label className="field-label">
                Customer Code
                <input
                  value={state.customerCode}
                  onChange={(event) => {
                    const nextCode = event.target.value;
                    setState((prev) => ({ ...prev, customerCode: nextCode }));
                  }}
                  onBlur={(event) => validateCode(event.target.value)}
                  required
                  placeholder="Enter customer code"
                />
              </label>
              <div className={`validation-note ${customerCodeClass}`}>{state.codeMessage}</div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={state.sendToCA}
                  onChange={(event) => setState((prev) => ({ ...prev, sendToCA: event.target.checked }))}
                />
                Send to CA Officer
              </label>

              <button className="btn-primary upload-btn" type="submit" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload Document'}
              </button>

              {state.uploadMessage ? <div className="toast success">{state.uploadMessage}</div> : null}
              {state.uploadError ? <div className="toast error">{state.uploadError}</div> : null}
            </form>
          </section>

          <section className="glass-card preview-card">
            <div className="panel-title-wrap">
              <h2>Document Preview</h2>
              <span className="status-chip">Live Preview</span>
            </div>
            {state.file ? (
              <div className="preview-box">
                {state.file.type.startsWith('image/') ? (
                  <img src={state.previewUrl} alt="Preview" className="preview-image" />
                ) : state.file.type === 'application/pdf' ? (
                  <iframe src={state.previewUrl} title="PDF preview" className="preview-iframe" />
                ) : (
                  <div className="preview-placeholder">Preview not available for this file type.</div>
                )}
                <div className="preview-details">
                  <strong>{state.file.name}</strong>
                  <span>Size: {(state.file.size / 1024).toFixed(1)} KB</span>
                  <span>Customer code: {state.customerCode || '—'}</span>
                  <span>Status: {state.sendToCA ? 'Will be sent to CA' : 'Uploaded only'}</span>
                </div>
              </div>
            ) : (
              <div className="preview-empty">Select a file to preview basic information instantly.</div>
            )}
          </section>

          <section className="glass-card documents-grid">
            <div className="panel-title-wrap">
              <h2>Dynamic Document Grid</h2>
              <p>Browse your latest uploads with live status and folder location.</p>
            </div>
            <div className="grid-cards">
              {(filteredDocuments.length ? filteredDocuments : documents).map((doc) => (
                <article key={doc.id} className="doc-card">
                  <div className="doc-card-header">
                    <span className="doc-tag">{doc.customer_code}</span>
                    <span className={`status-pill ${doc.sent_to_ca ? 'sent' : 'uploaded'}`}>
                      {doc.sent_to_ca ? 'Sent to CA' : 'Uploaded'}
                    </span>
                  </div>
                  <h3>Dropbox archive</h3>
                  <p>{doc.dropbox_path}</p>
                  <div className="doc-card-meta">
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    <span>{new Date(doc.created_at).toLocaleTimeString()}</span>
                  </div>
                </article>
              ))}
              {!documents.length && (
                <article className="doc-card empty-card">
                  <h3>No documents yet</h3>
                  <p>Upload your first file to populate the dashboard with your first document card.</p>
                </article>
              )}
            </div>
          </section>

          <section className="glass-card documents-panel">
            <h2>Your Recent Documents</h2>
            {loadingDocs ? (
              <p>Loading documents…</p>
            ) : filteredDocuments.length ? (
              <table>
                <thead>
                  <tr>
                    <th>Customer Code</th>
                    <th>Status</th>
                    <th>Uploaded At</th>
                    <th>Dropbox Path</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.customer_code}</td>
                      <td>{doc.sent_to_ca ? 'Sent to CA' : 'Uploaded'}</td>
                      <td>{new Date(doc.created_at).toLocaleString()}</td>
                      <td>{doc.dropbox_path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No matching documents found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
