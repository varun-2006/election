import { z } from "zod";
import { studentSchema } from "./student";

export const studentsSchema = z.array(studentSchema);

export type studentsType = z.infer<typeof studentsSchema>;
