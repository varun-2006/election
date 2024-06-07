import { z } from "zod";
import { houses, sections } from "../utils";

const sectionsSchema = z
  .array(z.enum(sections))
  .or(z.string())
  .default("ALL")
  .optional();

export const categorySchema = z.object({
  house: z.enum(houses).optional(),
  name: z.string().min(3).max(50),
  candidates: z
    .array(
      z.object({
        image: z.string(),
        id: z.string(),
      })
    )
    .length(2),
  electionId: z.string(),
});

export const electionSchema = z.object({
  name: z.string().min(3).max(50),
  complete: z.boolean().default(false),
  filters: z
    .object({
      "5": sectionsSchema,
      "6": sectionsSchema,
      "7": sectionsSchema,
      "8": sectionsSchema,
      "9": sectionsSchema,
      "10": sectionsSchema,
    })
    .or(z.string())
    .default("ALL"),
});

export type electionType = z.infer<typeof electionSchema>;
export type categoryType = z.infer<typeof categorySchema>;
