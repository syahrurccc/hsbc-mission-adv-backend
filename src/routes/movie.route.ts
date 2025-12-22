import { Router } from "express";

import {
  moviePatchSchema,
  movieQuerySchema,
  movieSchema,
} from "../validations/zodSchemas";
import { requireAuth } from "../middlewares/requireAuth";
import { Movie } from "../entity/Movie";
import { AppDataSource } from "../dataSource";
import { throwErr } from "../utils/utils";

const router = Router();
const movieRepo = AppDataSource.getRepository(Movie);

router.get("/", requireAuth, async (req, res) => {
  const q = movieQuerySchema.parse(req.query);
  const { type, year, sortBy, order, search } = q;

  const qb = movieRepo.createQueryBuilder("movie");

  if (type) qb.andWhere("movie.type = :type", { type });
  if (year) qb.andWhere("movie.year = :year", { year });

  // ILIKE is pg-exclusive version of case-insensitive LIKE
  if (search) {
    qb.andWhere("movie.title ILIKE :search", {
      search: `%${search}%`,
    });
  }

  if (sortBy) qb.orderBy(`movie.${sortBy}`, order ?? "ASC");

  const movies = await qb.getMany();

  res.status(200).json(movies);
});

router.post("/", async (req, res) => {
  const body = movieSchema.parse(req.body);
  const { title, poster_url, type, synopsis, year } = body;

  const movie = await movieRepo.save({
    title,
    poster_url,
    type,
    synopsis,
    year,
  });

  res.status(201).json({
    message: "Entry successfully created",
    entry: movie,
  });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const movie = await movieRepo.findOneBy({ id });

  if (!movie) throwErr("Movie not found", 404);

  res.status(200).json(movie);
});

router.patch("/:id", async (req, res) => {
  const body = moviePatchSchema.parse(req.body);
  const id = Number(req.params.id);
  const { title, poster_url, type, synopsis, year } = body;

  const movie = await movieRepo.findOneBy({ id });
  if (!movie) throwErr("Movie does not exist", 404);

  if (title) movie.title = title;
  if (poster_url) movie.poster_url = poster_url;
  if (type) movie.type = type;
  if (synopsis) movie.synopsis = synopsis;
  if (year) movie.year = year;

  const updatedMovie = await movieRepo.save(movie);

  res.status(200).json({
    message: "Entry successfully updated",
    entry: updatedMovie,
  });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { affected } = await movieRepo.delete({ id });

  if (!affected) throwErr("Movie not found", 404);

  res.status(200).json({ message: "Movie deleted" });
});

export default router;
