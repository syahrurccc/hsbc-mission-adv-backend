import { Router } from "express";

import * as db from "../db/db"

const router = Router();

router.get("/", async (_req, res) => {
  const { rows } = await db.query("SELECT * FROM movies");
  res.status(200).json(rows);
});

export default router;