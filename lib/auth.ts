import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { adminPasswordHashFromEnv } from "@/lib/admin-password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  logger: {
    error(error) {
      if (error instanceof CredentialsSignin) return;
      console.error("[auth]", error);
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;
        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const hash = adminPasswordHashFromEnv();
        if (!email || !password || !adminEmail || !hash) return null;
        if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
          return null;
        }
        const ok = await bcrypt.compare(password, hash);
        if (!ok) return null;
        return { id: "admin", email: adminEmail };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email as string;
      return session;
    },
  },
});
