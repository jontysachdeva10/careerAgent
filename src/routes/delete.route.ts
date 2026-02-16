import { Router } from "express";
import { deleteConversation } from "../services/deleteMessage.service";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = Router();

router.delete("/chat", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    await deleteConversation(userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

export default router;
