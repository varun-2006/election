import { authOptions } from "@/lib/auth";
import NextAuth, { getServerSession } from "next-auth";

export const getAuthSession = () => getServerSession(authOptions);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
