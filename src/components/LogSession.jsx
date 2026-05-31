import { useState } from "react"
const SUBJECTS = ["Math","Science","English","History","Computer Science","Physics","Chemistry","Other"]
const MOODS = [["??","Tired"],["??","Okay"],["??","Good"],["??","Focused"]]
export default function LogSession({ onLog }) {
  const [form, setForm] = useState({ subject:"Math", hours:"1", date: new Date().toISOString().slice(0,10), score:"7", mood:"??", notes:"" })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const set = (k,v) => setForm(f => ({...f,[k]:v}))
  function submit(e) {
    e.preventDefault()
    const hours = parseFloat(form.hours), score = parseInt(form.score)
    if (!hours || hours<=0 || hours>24) { setError("Hours must be between 0.25 and 24"); return }
    if (!score || score<1 || score>10) { setError("Score must be between 1 and 10"); return }
    setError(""); onLog({...form, hours, score})
    setForm(f => ({...f, notes:"", hours:"1", score:"7"}))
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }
  const inp = {width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:"8px",fontSize:"14px",background:"white"}
  const lbl = {fontSize:"13px",fontWeight:"500",color:"#64748b",display:"block",marginBottom:"6px"}
  return (
    <form onSubmit={submit} style={{maxWidth:"600px",display:"flex",flexDirection:"column",gap:"16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div><label style={lbl}>Subject</label><select name="subject" value={form.subject} onChange={e=>set("subject",e.target.value)} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
        <div><label style={lbl}>Duration (hours)</label><input type="number" value={form.hours} onChange={e=>set("hours",e.target.value)} min="0.25" max="24" step="0.25" style={inp} /></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Productivity Score (1–10)</label><input type="number" value={form.score} onChange={e=>set("score",e.target.value)} min="1" max="10" style={inp} /></div>
      </div>
      <div>
        <label style={lbl}>Focus / Mood</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}}>
          {MOODS.map(([emoji,label]) => (
            <button key={emoji} type="button" onClick={() => set("mood",emoji)}
              style={{padding:"10px 8px",border:`1.5px solid ${form.mood===emoji?"#1D9E75":"#e2e8f0"}`,borderRadius:"10px",background:form.mood===emoji?"#E1F5EE":"white",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
              <span style={{fontSize:"22px"}}>{emoji}</span>
              <span style={{fontSize:"11px",color:"#64748b"}}>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div><label style={lbl}>Notes (optional)</label><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="What topics did you cover? Any challenges?" style={{...inp,resize:"vertical",minHeight:"80px"}} /></div>
      {error && <p style={{color:"#e53e3e",fontSize:"13px",padding:"8px 12px",background:"#fff5f5",borderRadius:"6px",borderLeft:"3px solid #e53e3e"}}>{error}</p>}
      <button type="submit" style={{padding:"12px",background:"#1D9E75",color:"white",border:"none",borderRadius:"10px",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>+ Log Study Session</button>
      {saved && <div style={{padding:"10px 16px",background:"#E1F5EE",color:"#085041",borderRadius:"8px",fontSize:"14px",fontWeight:"500",textAlign:"center"}}>? Session logged!</div>}
    </form>
  )
}
