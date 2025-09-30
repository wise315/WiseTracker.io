import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();

export default function transferRoutes(io) {
  const router = express.Router();

  // ✅ Register user
  router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const hash = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: { email, password: hash, balance: 356 },
      });

      res.json({ message: "User registered" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ Login user
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ Transfer funds + emit Socket.IO event
  router.post("/transfer", authMiddleware, async (req, res) => {
    try {
      const { amount, description } = req.body;

      if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const newBalance = user.balance + parseFloat(amount);

      const [transaction, updatedUser] = await prisma.$transaction([
        prisma.transaction.create({
          data: {
            amount: parseFloat(amount),
            description: description || "Manual Transfer",
            userId: req.userId,
          },
        }),
        prisma.user.update({
          where: { id: req.userId },
          data: { balance: newBalance },
        }),
      ]);

      // 🔥 Emit transfer event to all connected clients
      io.emit("transfer_event", {
        userId: req.userId,
        amount: transaction.amount,
        description: transaction.description,
        balance: updatedUser.balance,
        createdAt: transaction.createdAt,
      });

      res.json({
        success: true,
        message: "Transfer successful",
        transaction,
        balance: updatedUser.balance,
      });
    } catch (err) {
      console.error("Transfer error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ Get balance
  router.get("/balance", authMiddleware, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { balance: true },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ balance: user.balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ Get recent transfers
  router.get("/transfers", authMiddleware, async (req, res) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
      });

      res.json(transactions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
}
