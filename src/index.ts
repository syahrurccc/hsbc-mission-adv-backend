import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import "reflect-metadata";

import authRouter from "./routes/auth.route";
import movieRouter from "./routes/movie.route";
import uploadRouter from "./routes/upload.route";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/error";
import { AppDataSource } from "./dataSource";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

async function startapp() {
  await AppDataSource.initialize();
  console.log("Database connected");
  
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());
  
  app.get("/", async (_req, res) => {
    res.json({ status: "ok"});
  });
  
  app.use("/auth", authRouter);
  app.use("/upload", uploadRouter);
  app.use("/movie", movieRouter);
  
  app.use(notFound);
  app.use(errorHandler);
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startapp().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
})

