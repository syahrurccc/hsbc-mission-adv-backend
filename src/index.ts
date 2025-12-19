import express from "express";
import morgan from "morgan";

import authRouter from "./routes/auth.route";
import movieRouter from "./routes/movie.route";
import uploadRouter from "./routes/upload.route";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/error";
import * as db from "./db/db"

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(morgan("dev"));
app.use("/upload", uploadRouter);

app.use(express.json());

app.get("/", async (_req, res) => {
  const { rows } = await db.query("SELECT NOW()")
  res.json(rows[0]);
});

app.use("/auth", authRouter);
app.use("/movie", movieRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
