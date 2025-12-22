import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { env } from "../env";
import { throwErr } from "../utils/utils";
import {
  registerSchema,
  loginSchema,
  verifyTokenSchema,
} from "../validations/zodSchemas";
import { requireAuth } from "../middlewares/requireAuth";
import { User } from "../entity/User";
import { AppDataSource } from "../dataSource";
import { randomBytes } from "node:crypto";

const router = Router();
const userRepo = AppDataSource.getRepository(User);

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
  const { fullname, username, email, password } =
    await registerSchema.parseAsync(req.body);

  const user = await userRepo.findOneBy({ email });
  const confirmationToken = randomBytes(16).toString("hex");
  const tokenExpiration = new Date(Date.now() + 86400 * 1000); // 24 hours

  if (user) {
    if (user.is_active) throwErr("Email is already registered", 409);
    user.activation_token = confirmationToken;
    user.token_expires_at = tokenExpiration;
    await userRepo.save(user);
  } else {
    const hash = await bcrypt.hash(password, 10);
    await userRepo.save({
      fullname,
      username,
      email,
      password: hash,
      activation_token: confirmationToken,
      token_expires_at: tokenExpiration,
      isActive: false,
    });
  }

  const info = await transporter.sendMail({
    from: '"harisenin" <della.kirlin@ethereal.email>',
    to: `${email}`,
    subject: "Activate Your Account",
    text: `Click here to activate: http://localhost:3000/auth/verify-email/${confirmationToken}/`,
    html: `<p>Click here to activate:
      <a href="http://localhost:3000/auth/verify-email/${confirmationToken}/">
      link
      </a>
      </p>`,
  });

  res.status(201).json({
    message: "User registered successfully. Please activate your account",
    sent: info.messageId,
    preview: nodemailer.getTestMessageUrl(info),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await userRepo.findOneBy({ email });
  if (!user) throwErr("Authentication failed", 401);

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throwErr("Authentication failed", 401);

  if (!user.is_active) throwErr("Activate Your Account First", 401);

  // authorize user
  const token = jwt.sign(
    {
      id: user.id,
      name: user.username,
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

  return res.status(200).json({ message: "You are logged in" });
});

router.get("/verify-email/:token", async (req, res) => {
  const token = verifyTokenSchema.parse(req.params.token);
  console.log(token)

  const user = await userRepo.findOneBy({ activation_token: token });
  if (!user) throwErr("Invalid or expired token ", 400);
  if (user.token_expires_at && user.token_expires_at < new Date()) {
    throwErr("Token expired", 400);
  }

  user.is_active = true;
  user.activation_token = null;
  user.token_expires_at = null;

  const newUser = await userRepo.save(user);
  console.log(newUser);

  res.json({ message: "Account verified successfully" });
});

router.get("/logout", (_req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.sendStatus(204);
});

export default router;
