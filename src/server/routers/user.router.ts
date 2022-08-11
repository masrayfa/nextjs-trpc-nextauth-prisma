import * as trpc from "@trpc/server";
import { z } from "zod";
import { signUpSchema } from "../../validation/auth";
import { createRouter } from "../createRouter";
import { hash } from "argon2";

export const userRouter = createRouter().mutation("register-user", {
  input: signUpSchema,
  async resolve({ ctx, input }) {
    const { email, password, username } = input;

    const exists = await ctx.prisma.user.findFirst({ where: { email } });

    if (exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const hashedPassword = await hash(password);

    const result = await ctx.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return {
      status: 201,
      message: "Account created successfully",
      result: result.email,
    };
  },
});

export type UserRouterType = typeof userRouter;
