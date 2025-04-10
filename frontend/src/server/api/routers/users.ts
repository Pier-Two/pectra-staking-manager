import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { UserSchema } from "pec/lib/api/schemas/database/user";
import { UserModel } from "pec/lib/database/models";
import { createContact } from "pec/lib/services/emailService";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure.input(UserSchema).mutation(async ({ input }) => {
    try {
      const { email, address } = input;
      const existingUser = await UserModel.findOne({ address });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this address already exists",
        });
      }

      const user = await UserModel.create({ email, address });

      try {
        await createContact({
          emailAddress: email,
        });
      } catch (emailError) {
        console.error("Failed to create email contact:", emailError);
      }

      return user;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
        cause: error,
      });
    }
  }),

  getUsersEmail: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }): Promise<string | null> => {
      try {
        const { address } = input;
        const user = await UserModel.findOne({ address }).select("email");
        return user ? user.email : null;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user email",
          cause: error,
        });
      }
    }),

  doesUserExist: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }): Promise<boolean> => {
      try {
        const { address } = input;
        const user = await UserModel.exists({ address });
        return !!user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check if user exists",
          cause: error,
        });
      }
    }),
});
