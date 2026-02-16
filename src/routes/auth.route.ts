import { Router } from "express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Login / Register
router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required!" });
  }

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  //   Create token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

export default router;
