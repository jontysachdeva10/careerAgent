import Groq from "groq-sdk";
import { AIMessage } from "../types/ai";

type Options = {
  temperature?: number;
  max_tokens?: number;
  onToken?: (token: string) => void;
  signal?: AbortSignal;
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callGroq(messages: AIMessage[], options?: Options) {
  try {
    const response = await groq.chat.completions.create(
      {
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 512,
        stream: true,
      },
      {
        signal: options?.signal,
      },
    );

    let fullContent = "";

    for await (const chunk of response) {
      const content = chunk.choices?.[0]?.delta?.content || "";

      if (!content) continue;

      fullContent += content;

      if (options?.onToken) {
        options.onToken(content);
      }
    }

    if (fullContent.trim() === "") {
      throw new Error("Groq returned empty content");
    }

    return fullContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  } catch (error) {
    console.error("Groq error:", error);
    throw error;
  }
}

export default callGroq;
