const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "Bearer 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"; // Replace with your secure key
const MODEL = "mistralai/mixtral-8x22b-instruct"; // Free-tier model

export async function getAIReply(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": OPENROUTER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Your goal is to generate helpful, context-aware, and grammatically correct replies to online messages.\n\nUse:\n1. *Context:* ongoing conversation or visible screen message.\n2. *User Intent:* what user wants to express.\n3. *Tone:* optional tone like friendly, formal, sarcastic.\n\nOnly return the suggested reply. No extra text or explanation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 256
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error("OpenRouter fetch failed: " + errText);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "No reply generated.";
}
