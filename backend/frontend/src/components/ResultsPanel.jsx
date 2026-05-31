import React from 'react';
import './ResultsPanel.css';
import ScoreRing from './ScoreRing';

function ResultsPanel({ results }) {
  const { score, verdict, detected_skills=[], missing_skills=[], strengths=[], gaps=[], summary, skill_count, word_count } = results;
  const scoreColor = score >= 75 ? '#3B6D11' : score >= 50 ? '#854F0B' : '#A32D2D';
  const scoreBg = score >= 75 ? '#EAF3DE' : score >= 50 ? '#FAEEDA' : '#FCEBEB';

  return (
    <div className="results-wrapper">
      <div className="score-card card">
        <ScoreRing score={score} />
        <div className="score-right">
          <div className="score-verdict" style={{ color: scoreColor, background: scoreBg }}>{verdict}</div>
          <div className="score-meta-grid">
            <div className="score-meta-item"><span className="meta-num">{skill_count}</span><span className="meta-label">skills found</span></div>
            <div className="score-meta-divider"/>
            <div className="score-meta-item"><span className="meta-num">{word_count?.toLocaleString()}</span><span className="meta-label">words</span></div>
            <div className="score-meta-divider"/>
            <div className="score-meta-item"><span className="meta-num">{missing_skills.length}</span><span className="meta-label">gaps found</span></div>
          </div>
        </div>
      </div>

      {summary && (
        <div className="card"><h2 className="section-title">✦ AI Summary</h2><p className="summary-text">{summary}</p></div>
      )}

      <div className="card skills-card">
        <h2 className="section-title"><span className="section-icon green">✓</span> Detected Skills <span className="count-badge green-badge">{detected_skills.length}</span></h2>
        <div className="skill-grid">{detected_skills.map(s => <span key={s} className="skill-pill skill-found">{s}</span>)}</div>
        <div className="skills-divider"/>
        <h2 className="section-title" style={{marginTop:0}}><span className="section-icon red">✕</span> Missing Skills <span className="count-badge red-badge">{missing_skills.length}</span></h2>
        <div className="skill-grid">{missing_skills.map(s => <span key={s} className="skill-pill skill-missing">{s}</span>)}</div>
      </div>

      {strengths.length > 0 && (
        <div className="card">
          <h2 className="section-title"><span className="section-icon amber">★</span> Strengths</h2>
          <ul className="strengths-list">{strengths.map((s,i) => <li key={i} className="strength-item"><span className="strength-dot"/>{s}</li>)}</ul>
        </div>
      )}

      {gaps.length > 0 && (
        <div className="card">
          <h2 className="section-title"><span className="section-icon purple">◎</span> Skill Gap Analysis</h2>
          <div className="gaps-grid">
            {gaps.map((g,i) => (
              <div key={i} className="gap-card">
                <div className="gap-header"><span className="gap-skill">{g.skill}</span><span className="gap-priority">Priority {i+1}</span></div>
                <div className="gap-body">
                  <div className="gap-row"><span className="gap-label why">Why</span><span className="gap-text">{g.why}</span></div>
                  <div className="gap-row"><span className="gap-label how">How</span><span className="gap-text">{g.how}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
