import express from "express";
import morgan from "morgan";

import movieRouter from "./routes/movie.route";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/error";
import * as db from "./db/db"

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (_req, res) => {
  const { rows } = await db.query("SELECT NOW()")
  res.json(rows[0]);
});


app.use("/movie", movieRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
