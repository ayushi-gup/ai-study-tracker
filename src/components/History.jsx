import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { getStats } from "../utils/storage.js"
const COLORS = {"Math":"#378ADD","Science":"#1D9E75","English":"#7F77DD","History":"#BA7517","Computer Science":"#D85A30","Physics":"#5DCAA5","Chemistry":"#D4537E","Other":"#888780"}
const BADGES = {"Math":{bg:"#E6F1FB",c:"#185FA5"},"Science":{bg:"#E1F5EE",c:"#0F6E56"},"English":{bg:"#EEEDFE",c:"#534AB7"},"History":{bg:"#FAEEDA",c:"#854F0B"},"Computer Science":{bg:"#FAECE7",c:"#993C1D"},"Physics":{bg:"#E1F5EE",c:"#085041"},"Chemistry":{bg:"#FBEAF0",c:"#993556"},"Other":{bg:"#F1EFE8",c:"#5F5E5A"}}
export default function History({ sessions, onDelete }) {
  const stats = useMemo(() => getStats(sessions), [sessions])
  const barData = useMemo(() => Object.entries(stats.subjectHours).map(([name,hours]) => ({name:name==="Computer Science"?"CS":name,hours:Math.round(hours*10)/10,fill:COLORS[name]||"#888"})), [stats])
  const lineData = useMemo(() => {
    const days = {}
    for (let i=6;i>=0;i--) { const d=new Date(); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); days[k]={date:k.slice(5),hours:0,score:null,count:0} }
    sessions.forEach(s => { if(days[s.date]){days[s.date].hours+=s.hours;days[s.date].score=(days[s.date].score||0)+s.score;days[s.date].count++} })
    return Object.values(days).map(d => ({...d,hours:Math.round(d.hours*10)/10,score:d.count?Math.round(d.score/d.count*10)/10:null}))
  }, [sessions])
  if (!sessions.length) return <div style={{textAlign:"center",padding:"60px 20px",color:"#64748b"}}><div style={{fontSize:"48px",marginBottom:"12px"}}>??</div><p>No sessions yet. Log your first one!</p></div>
  const card = {background:"white",border:"1px solid #e2e8f0",borderRadius:"12px",padding:"16px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
        {[["Total Hours",stats.totalHours+"h"],["Sessions",stats.totalSessions],["Avg Score",stats.avgScore+"/10"],["Subjects",Object.keys(stats.subjectHours).length]].map(([l,v]) => (
          <div key={l} style={card}><div style={{fontSize:"12px",color:"#64748b",marginBottom:"4px"}}>{l}</div><div style={{fontSize:"24px",fontWeight:"700",color:"#1D9E75"}}>{v}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div style={card}><div style={{fontSize:"14px",fontWeight:"600",marginBottom:"12px"}}>Hours by Subject</div>
          <ResponsiveContainer width="100%" height={180}><BarChart data={barData} margin={{top:4,right:8,left:-20,bottom:0}}><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip formatter={v=>[v+"h","Hours"]}/><Bar dataKey="hours" radius={[4,4,0,0]} fill="#1D9E75"/></BarChart></ResponsiveContainer>
        </div>
        <div style={card}><div style={{fontSize:"14px",fontWeight:"600",marginBottom:"12px"}}>Last 7 Days</div>
          <ResponsiveContainer width="100%" height={180}><LineChart data={lineData} margin={{top:4,right:8,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="date" tick={{fontSize:11}}/><YAxis tick={{fontSize:12}}/><Tooltip/><Legend wrapperStyle={{fontSize:12}}/><Line type="monotone" dataKey="hours" stroke="#1D9E75" strokeWidth={2} dot={{r:3}} name="Hours"/><Line type="monotone" dataKey="score" stroke="#378ADD" strokeWidth={2} dot={{r:3}} name="Score"/></LineChart></ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        <h3 style={{fontSize:"15px",fontWeight:"600",marginBottom:"4px"}}>Recent Sessions</h3>
        {sessions.map(s => {
          const b = BADGES[s.subject]||BADGES["Other"]
          return (
            <div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:"12px 14px",background:"white",border:"1px solid #e2e8f0",borderRadius:"10px"}}>
              <span style={{fontSize:"22px"}}>{s.mood}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                  <span style={{fontSize:"11px",fontWeight:"600",padding:"2px 8px",borderRadius:"20px",background:b.bg,color:b.c}}>{s.subject}</span>
                  <span style={{fontSize:"12px",color:"#64748b",marginLeft:"auto"}}>{s.date}</span>
                </div>
                <div style={{fontSize:"13px",color:"#64748b"}}>{s.hours}h · Score: {s.score}/10{s.notes?" · "+s.notes:""}</div>
              </div>
              <button onClick={() => onDelete(s.id)} style={{background:"none",border:"none",color:"#cbd5e1",fontSize:"14px",cursor:"pointer",padding:"2px 6px",borderRadius:"4px"}}>?</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
