import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "admin",
      name: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("400");

        const user = await db.admin.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (!user) throw new Error("401");

        const verify = await compare(credentials.password, user.password);
        if (!verify) throw new Error("401");
        return {
          email: user.email,
          name: user.name,
          id: user.id,
          isAdmin: true,
        };
      },
    }),
    CredentialsProvider({
      id: "students",
      name: "student",
      credentials: {
        std: { label: "standard", type: "number", placeholder: "Eg: 10" },
        section: { label: "section", type: "text" },
        rollNo: { label: "Roll No", type: "number" },
      },

      async authorize(credentials) {
        if (!credentials?.std || !credentials?.section || !credentials?.rollNo)
          throw new Error("400");

        const std = Number(credentials.std);
        const rollNo = Number(credentials.rollNo);

        const user = await db.student.findFirst({
          where: {
            std,
            rollNo,
            section: credentials.section,
          },
        });
        if (!user) throw new Error("401");
        return { ...user, isAdmin: false };
      },
    }),
    CredentialsProvider({
      id: "teacher",
      name: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("400");

        const user = await db.teacher.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (!user) throw new Error("401");

        const verify = await compare(credentials.password, user.password);
        if (!verify) throw new Error("401");
        return {
          name: user.name,
          id: user.email,
          isAdmin: false,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async jwt({ user, account, token }) {
      if (user) {
        if (account?.provider === "students")
          token = {
            id: user.id,
            house: user.house,
            std: user.std,
            section: user.section,
            isAdmin: false,
            name: user.name,
          };
        else if (account?.provider === "teacher")
          token = {
            email: user.email,
            name: user.name,
            isAdmin: false,
          };
        else
          token = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: true,
          };
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
