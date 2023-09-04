import { PrismaClient } from "@prisma/client";
import "server-only";

let prisma: PrismaClient = new PrismaClient();

export const db = prisma;
