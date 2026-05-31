import { useState } from "react"
import LogSession from "./components/LogSession.jsx"
import History from "./components/History.jsx"
import AIInsights from "./components/AIInsights.jsx"
import { getSessions, addSession, deleteSession } from "./utils/storage.js"

export default function App() {
  const [tab, setTab] = useState("log")
  const [sessions, setSessions] = useState(() => getSessions())
  const handleLog = (data) => setSessions(addSession(data))
  const handleDelete = (id) => setSessions(deleteSession(id))
  const tabs = [["log","?? Log Session"],["history","?? History"],["insights","?? AI Insights"]]
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{background:"white",borderBottom:"1px solid #e2e8f0",padding:"16px 24px",display:"flex",alignItems:"center",gap:"14px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
        <span style={{fontSize:"32px",background:"#E1F5EE",borderRadius:"12px",width:"48px",height:"48px",display:"flex",alignItems:"center",justifyContent:"center"}}>??</span>
        <div>
          <h1 style={{fontSize:"20px",fontWeight:"700"}}>Study Tracker AI</h1>
          <p style={{fontSize:"13px",color:"#64748b"}}>Log sessions · Visualize progress · Get AI coaching</p>
        </div>
        <span style={{marginLeft:"auto",fontSize:"13px",background:"#E1F5EE",color:"#085041",padding:"6px 14px",borderRadius:"20px",fontWeight:"500"}}>{sessions.length} sessions</span>
      </header>
      <nav style={{background:"white",borderBottom:"1px solid #e2e8f0",padding:"0 24px",display:"flex"}}>
        {tabs.map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{padding:"14px 20px",border:"none",background:"none",fontSize:"14px",fontWeight:"500",cursor:"pointer",color: tab===id ? "#1D9E75" : "#64748b",borderBottom: tab===id ? "2px solid #1D9E75" : "2px solid transparent",marginBottom:"-1px"}}>
            {label}
          </button>
        ))}
      </nav>
      <main style={{flex:"1",padding:"28px 24px",maxWidth:"900px",width:"100%",margin:"0 auto"}}>
        {tab === "log"      && <LogSession onLog={handleLog} />}
        {tab === "history"  && <History sessions={sessions} onDelete={handleDelete} />}
        {tab === "insights" && <AIInsights sessions={sessions} />}
      </main>
      <footer style={{textAlign:"center",padding:"16px",fontSize:"12px",color:"#64748b",borderTop:"1px solid #e2e8f0",background:"white"}}>
        Built with React + Claude AI · CS Project
      </footer>
    </div>
  )
}
