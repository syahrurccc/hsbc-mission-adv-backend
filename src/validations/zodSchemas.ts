import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().trim().optional(),
  poster_url: z.url().optional(),
  type: z.enum(["movie", "series"]).optional(),
  synopsis: z.string().trim().optional(),
  year: z.number().nonnegative().optional(),
})