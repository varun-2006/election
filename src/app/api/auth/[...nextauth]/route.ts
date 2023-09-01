import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
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
        return { email: user.email, name: user.username, id: user.id };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: "/signin",
  },
};

export const getAuthSession = () => getServerSession(authOptions);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
