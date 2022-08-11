import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "../../../validation/auth";
import { verify } from "argon2";

const prisma = new PrismaClient();

/**
 * using providers i.e github
 */
export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GithubProvider({
    //   // @ts-ignore
    //   clientId: process.env.GITHUB_ID,
    //   // @ts-ignore
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "bonar@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const creds = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verify(user.password!, creds.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
    // async redirect({ baseUrl, url }) {
    //   return baseUrl;
    // },
    // signIn: ({ user }) => {
    //   console.log(user.email);
    //   return user.email as string;
    // },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
};

export default NextAuth(nextAuthOptions);
