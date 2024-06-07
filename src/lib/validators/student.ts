import { z } from "zod";
import { houses, sections } from "../utils";

export const studentSchema = z.object({
  std: z.number().min(5).max(10),
  section: z.enum(sections),
  rollNo: z.number().min(1).max(60),
  name: z.string().min(4).max(50),
  house: z.enum(houses),
});

export type studentType = z.infer<typeof studentSchema>;
