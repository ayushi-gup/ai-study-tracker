import React, { useState, useEffect } from 'react';
import './Loader.css';

const STEPS = ['Extracting resume content…', 'Detecting technical skills…', 'Computing resume score…', 'Running AI gap analysis…'];

function Loader() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((p) => (p + 1) % STEPS.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loader-card card">
      <div className="loader-dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
      <p className="loader-step">{STEPS[step]}</p>
      <div className="loader-bar-track"><div className="loader-bar-fill"/></div>
    </div>
  );
}

export default Loader;
