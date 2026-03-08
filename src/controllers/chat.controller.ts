import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { processChat } from "../services/chat.service";

export async function chat(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const { message } = req.body;

  const reply = await processChat(userId, message);
  res.json({ reply });
}

export async function chatStream(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const { message } = req.body;

  const controller = new AbortController();

  // Detect client disconnect
  req.on("close", () => {
    controller.abort();
    console.log("Client disconnected → AI request aborted");
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    await processChat(userId, message, {
      onToken: (token) => {
        res.write(`data: ${token}\n\n`);
      },
    });

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    await processChat(userId, message, {
      onToken: (token) => {
        res.write(`data: ${token}\n\n`);
      },
    });

    res.write(`data: [DONE]\n\n`);
    res.end();
  }
}
