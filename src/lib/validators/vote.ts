import { z } from "zod";

export const studentVoteSchema = z.object({
  candidateId: z.string(),
  voterId: z.string(),
  electionId: z.string(),
}).array();

export const teacherVoteSchema = z.object({
  candidateId: z.string(),
  voterEmail: z.string(),
  electionId: z.string(),
}).array();

export type studentVoteType = z.infer<typeof studentVoteSchema>;
export type teacherVoteType = z.infer<typeof teacherVoteSchema>;
