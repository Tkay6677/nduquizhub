import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) return null;
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email });
        if (!user) return null;
        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          department: user.department,
          level: user.level,
          badges: user.badges,
          totalScore: user.totalScore,
          quizzesCompleted: user.quizzesCompleted,
          averageScore: user.averageScore,
            role: user.role ?? 'user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
