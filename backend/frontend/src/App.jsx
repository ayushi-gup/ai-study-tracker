import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import UploadZone from './components/UploadZone';
import ResultsPanel from './components/ResultsPanel';
import Loader from './components/Loader';

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setResults(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_description', jobDesc);
      const response = await axios.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo"><span className="logo-icon">◈</span><span className="logo-text">ResumeAI</span></div>
          <div className="header-badge">Powered by Claude</div>
        </div>
      </header>
      <main className="app-main">
        <section className="hero">
          <h1 className="hero-title">Analyze your resume<br /><span className="hero-accent">with AI precision</span></h1>
          <p className="hero-sub">Detect skills · Score your resume · Get personalized gap analysis</p>
        </section>
        <div className="card upload-card">
          <UploadZone file={file} onFileSelected={handleFileSelected} onRemove={() => { setFile(null); setResults(null); setError(''); }} />
          <div className="field-group">
            <label className="field-label" htmlFor="job-desc">
              Target role / job description <span className="field-optional">optional</span>
            </label>
            <textarea id="job-desc" className="field-textarea" placeholder="Paste the job description or describe the role..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={4} />
            <p className="field-hint">Adding a job description makes gap suggestions much more targeted.</p>
          </div>
          {error && <div className="error-banner">⚠ {error}</div>}
          <button className="analyze-btn" onClick={handleAnalyze} disabled={!file || loading}>
            {loading ? 'Analyzing…' : 'Analyze Resume →'}
          </button>
        </div>
        {loading && <Loader />}
        {results && !loading && <div ref={resultsRef}><ResultsPanel results={results} /></div>}
      </main>
      <footer className="app-footer"><p>Built with React · Flask · Claude API</p></footer>
    </div>
  );
}

export default App;
 