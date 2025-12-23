import { Router } from "express";
import path from "node:path";
import fs from "node:fs";
import multer from "multer";

import { throwErr } from "../utils/utils";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

const filesDir = path.resolve("uploads");
fs.mkdirSync(filesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, filesDir);
  },
  filename: (_req: any, file: any, cb: any) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", requireAuth, upload.single("poster"), async (req, res) => {
  if (!req.file) throwErr("No file uploaded", 400);
  res.status(201).json({
    message: "File successfully uploaded",
    file: req.file,
  });
});

export default router;
