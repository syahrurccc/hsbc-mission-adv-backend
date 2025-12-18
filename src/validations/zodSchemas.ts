import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().trim().optional(),
  poster_url: z.url().optional(),
  type: z.enum(["movie", "series"]).optional(),
  synopsis: z.string().trim().optional(),
  year: z.number().nonnegative().optional(),
})

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

export const loginSchema = z
  .object({
    email: z.email().trim(),
    password: z.string().min(8),
  })
  .strict();