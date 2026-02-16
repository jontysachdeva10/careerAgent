import { PROFILE_EXTRACTION_PROMPT } from "../prompts/extraction.prompt";
import { AIMessage } from "../types/ai";
import callGroq from "./groq.service";

async function extractProfile(conversation: string) {
  const messages: AIMessage[] = [
    { role: "system", content: PROFILE_EXTRACTION_PROMPT },
    { role: "user", content: conversation },
  ];

  try {
    const response = await callGroq(messages, {
      temperature: 0,
      max_tokens: 300,
    });

    if (!response) return null;
    const parsed = JSON.parse(response);

    // Hard validation guard
    if (typeof parsed !== "object" || parsed === null) return null;

    return {
      currentRole: parsed.currentRole ?? null,
      targetRole: parsed.targetRole ?? null,
      experienceYears:
        typeof parsed.experienceYears === "number"
          ? parsed.experienceYears
          : null,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      interests: Array.isArray(parsed.interests) ? parsed.interests : [],
      goals: parsed.goals ?? null,
      education: parsed.education ?? null,
      industry: parsed.industry ?? null,
      location: parsed.location ?? null,
    };
  } catch (error) {
    console.error("Profile extraction failed:", error);
    return null;
  }
}

export default extractProfile;
