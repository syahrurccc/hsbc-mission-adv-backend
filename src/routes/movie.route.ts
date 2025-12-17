import { Router } from "express";

import * as db from "../db/db";
import { throwErr } from "../utils/utils";
import { movieSchema } from "../validations/zodSchemas";

const router = Router();

router.post("/", async (req, res) => {
  const body = movieSchema.parse(req.body);
  const { title, poster_url, type, synopsis, year } = body;

  const { rows } = await db.query(
    `INSERT INTO movies
    (title, poster_url, type, synopsis, year)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [title, poster_url, type, synopsis, year],
  );

  res
    .status(201)
    .json({ message: "Entry successfully created", entry: rows[0] });
});

router.get("/:id", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM movies WHERE id = $1", [
    req.params.id,
  ]);

  if (!rows[0]) throwErr("Movie not found", 404);

  res.status(200).json(rows[0]);
});

router.patch("/:id", async (req, res) => {
  const body = movieSchema.parse(req.body);
  const { title, poster_url, type, synopsis, year } = body;

  const { rows } = await db.query(
    `
    UPDATE movies
    SET title = COALESCE($1, title),
        poster_url = COALESCE($2, poster_url),
        type = COALESCE($3, type),
        synopsis = COALESCE($4, synopsis),
        year = COALESCE($5, year)
    WHERE id = $6
    RETURNING *
    `,
    [title, poster_url, type, synopsis, year, req.params.id],
  );

  res
    .status(200)
    .json({ message: "Entry successfully updated", entry: rows[0] });
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM movies WHERE id = $1", [
    req.params.id,
  ]);

  if (rowCount === 0) throwErr("Movie not found", 404);

  res.status(200).json({ message: "Movie deleted" });
});

export default router;
