import { useState, useRef, useEffect } from "react"
import { askAI } from "../utils/aiEngine.js"
import { getDataSummary } from "../utils/storage.js"
const QUICK = [
  ["?? Efficiency tips","Give me 3 specific tips to improve my study efficiency based on my data"],
  ["?? Predict trends","Which subjects should I focus on this week and why?"],
  ["?? Weekly summary","Give me a weekly performance summary with strengths and areas to improve"],
  ["?? Weak spots","Which subject am I neglecting and how should I fix it?"],
  ["?? Consistency","Am I studying consistently enough? What would an ideal schedule look like?"],
  ["?? Burnout risk","Based on my mood and score trends, am I at risk of burnout?"],
]
export default function AIInsights({ sessions }) {
  const [msgs, setMsgs] = useState([{role:"assistant",content:"Hi! I am your AI study coach powered by Claude. Log some sessions and ask me anything about your study habits! ??"}])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottom = useRef(null)
  useEffect(() => { bottom.current?.scrollIntoView({behavior:"smooth"}) }, [msgs])
  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput(""); setMsgs(p => [...p,{role:"user",content:msg}]); setLoading(true)
    try {
      const reply = await askAI(msg, getDataSummary(sessions), msgs.slice(-6))
      setMsgs(p => [...p,{role:"assistant",content:reply}])
    } catch(e) {
      setMsgs(p => [...p,{role:"assistant",content:"Error: "+e.message}])
    } finally { setLoading(false) }
  }
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
        {QUICK.map(([label,prompt]) => (
          <button key={label} onClick={() => send(prompt)} disabled={loading}
            style={{padding:"6px 14px",borderRadius:"20px",border:"1.5px solid #e2e8f0",background:"white",fontSize:"13px",cursor:"pointer",opacity:loading?0.5:1}}>
            {label}
          </button>
        ))}
      </div>
      <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"16px",minHeight:"300px",maxHeight:"440px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"12px"}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",gap:"8px",flexDirection:m.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}>
            {m.role==="assistant" && <span style={{fontSize:"20px"}}>??</span>}
            <div style={{maxWidth:"82%",padding:"10px 14px",borderRadius:"12px",fontSize:"14px",lineHeight:"1.6",background:m.role==="user"?"#f1f5f9":"#E1F5EE",color:m.role==="user"?"#1a1a2e":"#085041",whiteSpace:"pre-wrap"}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:"8px",alignItems:"flex-start"}}>
            <span style={{fontSize:"20px"}}>??</span>
            <div style={{padding:"12px 16px",borderRadius:"12px",background:"#E1F5EE",color:"#085041",fontSize:"14px"}}>Thinking...</div>
          </div>
        )}
        <div ref={bottom}/>
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} disabled={loading}
          placeholder="Ask about your study habits, trends, or get advice..."
          style={{flex:"1",padding:"10px 14px",border:"1.5px solid #e2e8f0",borderRadius:"10px",fontSize:"14px"}} />
        <button onClick={()=>send()} disabled={loading||!input.trim()}
          style={{padding:"10px 20px",background:"#1D9E75",color:"white",border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:"600",cursor:"pointer",opacity:loading||!input.trim()?0.5:1}}>
          Send ?
        </button>
      </div>
      <p style={{fontSize:"12px",color:"#64748b",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"8px",padding:"8px 12px"}}>
        ?? Add your Anthropic API key in src/utils/aiEngine.js — get one free at console.anthropic.com
      </p>
    </div>
  )
}
