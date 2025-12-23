import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import { env } from "../env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Missing JWT token" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!);
    req.userId = (decoded as any).id;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
