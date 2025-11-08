import { z } from "zod";

/**
 * Схема для рейтинга пользователя
 */
export const ratingSchema = z.object({
  id: z.number(),
  name: z.string(),
  score: z.number(),
  avatar: z.string().optional(),
  level: z.string(),
});

export type Rating = z.infer<typeof ratingSchema>;

