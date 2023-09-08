import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    session:
      | {
          id: string;
          house: string;
          std: number;
          section: string;
          isAdmin: boolean;
          name: string;
        }
      | {
          email: string;
          name: string;
          isAdmin: boolean;
        }
      | {
          id: string;
          email: string;
          name: string;
          isAdmin: boolean;
        };
  }

  interface User {
    id?: string;
    name: string;
    isAdmin: boolean;
    house?: string;
    std?: number;
    section?: string;
    email?: string;
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
