import { z } from "zod";

export const studentSchema = z.object({
  std: z.number().min(1).max(10),
  section: z.string().max(1).min(1),
  rollNo: z.number().min(1).max(45),
  name: z.string().min(4).max(40),
  house: z.enum(["ETON", "OXFORD", "HARROW", "LEEDS"]),
});

export type studentType = z.infer<typeof studentSchema>;
