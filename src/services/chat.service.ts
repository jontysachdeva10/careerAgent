import { prisma } from "../prisma";
import { AIMessage } from "../types/ai";
import mergeProfile from "../utils/mergeProfile";
import { buildProfileContext } from "../utils/profile";
import callGroq from "./groq.service";
import extractProfile from "./profile.service";

const SYSTEM_PROMPT = `
  You are a professional AI career strategist.

  You help users across ANY domain:
  - Technology
  - Finance
  - Medicine
  - Arts
  - Entrepreneurship
  - Academia
  - Trades
  - Or any other field

  You analyze:
  - Experience
  - Skills
  - Goals
  - Industry
  - Constraints

  You give:
  - Strategic advice
  - Skill gap analysis
  - Roadmaps
  - Action plans

  Be practical, structured, and realistic.
`;

async function processChat(userId: string, userMessage: string) {
  // 1. Ensure user exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  // 2. Save user message
  await prisma.message.create({
    data: {
      role: "user",
      content: userMessage,
      userId,
    },
  });

  // 3. Load conversation history
  const history = await prisma.message.findMany({
    where: {
      userId,
      content: {
        not: "",
      },
      deleted: false,
    },
    orderBy: { createdAt: "desc" },
    take: 4, // last N messages
  });

  const orderedHistory = history.reverse();

  // 4. Load User
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profile: true },
  });

  const profileContext = buildProfileContext(user?.profile);

  const systemContent = `
    ${SYSTEM_PROMPT}

    ${profileContext || ""}
  `.trim();

  // 5. Build messages
  const messages: AIMessage[] = [
    { role: "system", content: systemContent },
    ...orderedHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  // 6. Call Groq
  const reply = await callGroq(messages, { temperature: 0.7 });

  // 7. Save assistant reply
  if (reply) {
    await prisma.message.create({
      data: {
        role: "assistant",
        content: reply,
        userId,
      },
    });
  }

  // 8. Build conversation text
  const conversationText = orderedHistory
    .filter((m) => m.role === "user")
    .slice(-3) // last 3 user messages only
    .map((m) => m.content)
    .join("\n");

  // 9. Extract profile
  const extracted = await extractProfile(conversationText);

  if (extracted) {
    await prisma.profile.upsert({
      where: { userId },
      update: mergeProfile(user?.profile ?? {}, extracted),
      create: {
        userId,
        ...extracted,
      },
    });
  }

  return reply;
}

export default processChat;
