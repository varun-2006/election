import { z } from "zod";
import { teacherSchema } from "./teacher";

export const manyTeachersSchema = z.array(teacherSchema);

export type manyTeachersType = z.infer<typeof manyTeachersSchema>;
