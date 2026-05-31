import React from 'react';

function ScoreRing({ score }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const offset = circumference / 4;
  const color = score >= 75 ? '#3B6D11' : score >= 50 ? '#854F0B' : '#A32D2D';
  const trackColor = score >= 75 ? '#c0dd97' : score >= 50 ? '#FAC775' : '#f7c1c1';

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`Score: ${score}/100`}>
      <circle cx="55" cy="55" r={radius} fill="none" stroke={trackColor} strokeWidth="8" />
      <circle cx="55" cy="55" r={radius} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${filled.toFixed(2)} ${circumference.toFixed(2)}`}
        strokeDashoffset={offset.toFixed(2)} strokeLinecap="round" />
      <text x="55" y="50" textAnchor="middle" fontSize="26" fontWeight="800" fill={color} fontFamily="Syne,sans-serif">{score}</text>
      <text x="55" y="68" textAnchor="middle" fontSize="11" fill="#888780" fontFamily="DM Mono,monospace">/ 100</text>
    </svg>
  );
}

export default ScoreRing;
