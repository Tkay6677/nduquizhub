import { DefaultSession, DefaultUser } from "next-auth";

// Extend the NextAuth Session and User types to include our custom fields
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      department: string;
      level: string;
      badges: string[];
      totalScore: number;
      quizzesCompleted: number;
      averageScore: number;
      role: string;
    };
  }

  interface User extends DefaultUser {
    role: string;
    department: string;
    level: string;
    badges: string[];
    totalScore: number;
    quizzesCompleted: number;
    averageScore: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    department: string;
    level: string;
    badges: string[];
    totalScore: number;
    quizzesCompleted: number;
    averageScore: number;
  }
}
