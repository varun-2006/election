import { z } from "zod";
import { studentSchema } from "./student";

export const searchStudentSchema = studentSchema.pick({
  std: true,
  section: true,
  rollNo: true,
});

export type searchStudentType = z.infer<typeof searchStudentSchema>;
