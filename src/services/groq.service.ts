import Groq from "groq-sdk";
import { AIMessage } from "../types/ai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callGroq(messages: AIMessage[], options?: { temperature?: number; max_tokens?: number; }) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 512,
    });

    const content = response.choices?.[0]?.message?.content;

    if(!content || content.trim() === "") {
      throw new Error("Groq returned empty content");  
    }

    return content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
;
  } catch (error) {
    console.error("Groq error:", error);
    throw error;
  }
}

export default callGroq;
