import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/validator";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim();
        const passwd = String(credentials?.passwd ?? "");

        if (!email || !passwd) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwd) return null;

        const ok = await comparePassword(passwd, user.passwd);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image,
          isadmin: user.isadmin,
        };
      },
    }),
    Github,
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      const email = user.email;
      const name = user.name;

      if (!email || !name) return false;

      let dbUser = await prisma.user.findUnique({ where: { email } });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email,
            name,
            image: user.image,
          },
        });
      }

      user.id = String(dbUser.id);
      user.name = dbUser.name;
      user.image = dbUser.image;
      user.isadmin = dbUser.isadmin;

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // session.update() 같은 케이스
      const u = trigger === "update" ? session?.user : user;

      if (u) {
        token.id = u.id;
        token.email = u.email;
        token.name = u.name;
        token.image = u.image;
        token.isadmin = u.isadmin;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.email = String(token.email ?? "");
        session.user.name = token.name ?? null;
        session.user.image = String(token.image ?? token.picture ?? "");
        session.user.isadmin = Boolean(token.isadmin);
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign/in",
    error: "/sign/in",
  },

  session: { strategy: "jwt" },

  trustHost: true,
  jwt: { maxAge: 30 * 60 },
});
