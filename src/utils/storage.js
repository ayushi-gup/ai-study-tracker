const KEY = "study_tracker_sessions"
export function getSessions() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] }
}
export function saveSessions(s) { localStorage.setItem(KEY, JSON.stringify(s)) }
export function addSession(session) {
  const sessions = getSessions()
  const s = { ...session, id: Date.now() }
  sessions.unshift(s); saveSessions(sessions); return sessions
}
export function deleteSession(id) {
  const sessions = getSessions().filter(s => s.id !== id)
  saveSessions(sessions); return sessions
}
export function getStats(sessions) {
  if (!sessions.length) return { totalHours: 0, totalSessions: 0, avgScore: 0, subjectHours: {} }
  const totalHours = Math.round(sessions.reduce((a,s) => a+s.hours, 0) * 10) / 10
  const avgScore = Math.round(sessions.reduce((a,s) => a+s.score, 0) / sessions.length * 10) / 10
  const subjectHours = {}
  sessions.forEach(s => { subjectHours[s.subject] = (subjectHours[s.subject]||0) + s.hours })
  return { totalHours, totalSessions: sessions.length, avgScore, subjectHours }
}
export function getDataSummary(sessions) {
  if (!sessions.length) return "No study sessions logged yet."
  const stats = getStats(sessions)
  const recent = sessions.slice(0,7).map(s => `${s.date}|${s.subject}|${s.hours}h|score:${s.score}|mood:${s.mood}|notes:${s.notes||"none"}`).join("\n")
  const weekHours = sessions.filter(s => (Date.now()-new Date(s.date))/(86400000) <= 7).reduce((a,s)=>a+s.hours,0).toFixed(1)
  return `Total sessions: ${stats.totalSessions}\nTotal hours: ${stats.totalHours}h\nAvg score: ${stats.avgScore}/10\nThis week: ${weekHours}h\nSubject hours: ${JSON.stringify(stats.subjectHours)}\nRecent sessions:\n${recent}`
}
