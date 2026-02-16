import { Response } from "express";
import processChat from "../services/chat.service";
import { AuthRequest } from "../middleware/auth";

async function chat(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const { message } = req.body;

  const reply = await processChat(userId, message);
  res.json({ reply });
}

export default chat;
