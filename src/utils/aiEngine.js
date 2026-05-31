const API_KEY = "YOUR_ANTHROPIC_API_KEY"
const API_URL = "https://api.anthropic.com/v1/messages"
const MODEL = "claude-sonnet-4-20250514"
const SYSTEM = "You are an expert AI study coach. Analyze the student data and give specific, actionable advice in 3-5 sentences. Be encouraging but honest."

export async function askAI(userMessage, dataSummary, chatHistory = []) {
  if (!API_KEY || API_KEY === "YOUR_ANTHROPIC_API_KEY") {
    return "?? Please set your Anthropic API key in src/utils/aiEngine.js — get a free key at console.anthropic.com"
  }
  const messages = [
    ...chatHistory.slice(-6),
    { role: "user", content: `Student data:\n${dataSummary}\n\nQuestion: ${userMessage}` }
  ]
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 1000, system: SYSTEM, messages })
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text || "No response."
}
