import { z } from "zod";

export const movieQuerySchema = z.object({
  type: z.enum(["movie", "series"]).optional(),
  year: z.number().positive().min(1800).optional(),
  sortBy: z.enum(["id", "title", "type", "year"]).optional(),
  order: z.enum(["ASC", "DESC"]).optional(),
  search: z.string().trim().optional()
});

export const movieSchema = z.object({
  title: z.string().nonempty().trim(),
  poster_url: z.url(),
  type: z.enum(["movie", "series"]),
  synopsis: z.string().nonempty().trim(),
  year: z.number().min(1800).positive(),
});

export const moviePatchSchema = movieSchema.partial();

export const registerSchema = z
  .object({
    fullname: z.string().min(3).trim(),
    username: z.string().min(3).trim(),
    email: z.email().trim(),
    password: z.string().min(8),
    confirmation: z.string().min(8),
  })
  .refine((s) => s.password === s.confirmation, {
    message: "Password must match",
    path: ["confirmation"],
    when(payload) {
      return registerSchema
        .pick({ password: true, confirmation: true })
        .safeParse(payload.value).success;
    },
  });

export const verifyTokenSchema = z.string().length(32);

export const loginSchema = z
  .object({
    email: z.email().trim(),
    password: z.string().min(8),
  })
  .strict();