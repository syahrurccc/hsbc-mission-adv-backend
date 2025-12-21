import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

import { env } from "../env";
import { throwErr } from "../utils/utils";
import { registerSchema, loginSchema } from "../validations/zodSchemas";
import { requireAuth } from "../middlewares/requireAuth";
import { userRepo } from "../entity/User";

const router = Router();
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

router.post("/register", async (req, res) => {
  const { fullname, username, email, password } = await registerSchema.parseAsync(req.body);

  const { rows } = await db.query("SELECT * from users WHERE email = $1", [email]);
  if (rows[0]) throwErr("Email is already registered", 409);

  const hash = await bcrypt.hash(password, 10);
  await db.query(
    `INSERT INTO users
    (fullname, username, email, password)
    VALUES ($1, $2, $3, $4)`,
    [fullname, username, email, hash],
  );

  res.status(201).json({
    message: "User registered successfully",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const { rows } = await db.query("SELECT * from users WHERE email = $1", [email]);
  if (!rows[0]) throwErr("Authentication failed", 401);
  
  const user = rows[0];

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throwErr("Authentication failed", 401);
  
  // authorize user
  const token = jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
    },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 59 * 60 * 1000,
  });
  
  return res.status(200).json({ message: "You are loggen in" });
});

router.get("/verify-email", requireAuth, (req, res) => { 
  
});

router.get("/logout", requireAuth, (_req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.sendStatus(204);
});

export default router;
