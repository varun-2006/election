import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    name: string;
    isAdmin: boolean;
    house?: string;
    std?: number;
    section?: string;
    email?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    house?: string;
    std?: number;
    section?: string;
    isAdmin: boolean;
    email?: string;
    name: string;
  }
}
