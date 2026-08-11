import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { signToken } from "../lib/jwt.js";
import { validateSignup, validateLogin } from "../lib/validateAuth.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const authRouter = Router();

// Never send the password hash back to the client.
function toPublicUser(user: { id: string; fullName: string; email: string; createdAt: Date }) {
  return { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt };
}

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { errors, value } = validateSignup(req.body);
    if (!value) {
      res.status(400).json({ error: errors.join(", ") });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: value.email } });
    if (existing) {
      res.status(409).json({ error: "An account with that email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(value.password, 10);
    const user = await prisma.user.create({
      data: { fullName: value.fullName, email: value.email, passwordHash },
    });

    const token = signToken({ userId: user.id });
    res.status(201).json({ token, user: toPublicUser(user) });
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { errors, value } = validateLogin(req.body);
    if (!value) {
      res.status(400).json({ error: errors.join(", ") });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: value.email } });

    // Same generic error whether the email doesn't exist or the password is
    // wrong - telling them apart lets an attacker enumerate registered emails.
    const invalid = () => res.status(401).json({ error: "Invalid email or password" });

    if (!user) {
      invalid();
      return;
    }

    const passwordMatches = await bcrypt.compare(value.password, user.passwordHash);
    if (!passwordMatches) {
      invalid();
      return;
    }

    const token = signToken({ userId: user.id });
    res.status(200).json({ token, user: toPublicUser(user) });
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: toPublicUser(user) });
  }),
);
