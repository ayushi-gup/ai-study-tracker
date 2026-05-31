import React, { useRef, useState } from 'react';
import './UploadZone.css';

function UploadZone({ file, onFileSelected, onRemove }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const processFile = (f) => {
    setError('');
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) { setError('Only PDF and TXT files are supported.'); return; }
    onFileSelected(f);
  };

  if (file) return (
    <div className="file-chosen">
      <span className="file-icon">📄</span>
      <div className="file-info">
        <p className="file-name">{file.name}</p>
        <p className="file-meta">{(file.size / 1024).toFixed(1)} KB · ready to analyze</p>
      </div>
      <button className="remove-btn" onClick={onRemove}>✕</button>
    </div>
  );

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf,.txt" onChange={(e) => { if (e.target.files[0]) processFile(e.target.files[0]); }} style={{ display: 'none' }} />
        <div className="upload-icon-wrap"><span>⬆</span></div>
        <p className="upload-label">{dragging ? 'Drop it here' : 'Drop your resume here'}</p>
        <p className="upload-sub">or <span className="upload-link">click to browse</span> · PDF or TXT</p>
      </div>
      {error && <p className="extract-error">{error}</p>}
    </div>
  );
}

export default UploadZone;