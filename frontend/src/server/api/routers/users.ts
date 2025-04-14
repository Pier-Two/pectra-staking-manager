import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { UserSchema, type UserType } from "pec/lib/api/schemas/database/user";
import { UserModel } from "pec/lib/database/models";
import { createContact } from "pec/lib/services/emailService";
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "pec/lib/wallet/auth";

export const userRouter = createTRPCRouter({
  createOrUpdateUser: publicProcedure
    .input(UserSchema)
    .mutation(async ({ input }) => {
      try {
        const { address, email, firstName, lastName, companyName } = input;
        const existingUser = await UserModel.findOne({
          address,
        });

        try {
          if (existingUser) {
            const updatedUser = await UserModel.updateOne(
              { address },
              { $set: input },
            );
            return updatedUser;
          } else {
            const newUser = await UserModel.create({
              ...input,
            });

            const contactData = {
              emailAddress: email,
              ...(firstName && { customerFirstName: firstName }),
              ...(lastName && { customerLastName: lastName }),
              ...(companyName && { companyName: companyName }),
            };

            await createContact(contactData);
            return newUser;
          }
        } catch (error) {
          console.error("Failed to create or update email contact:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
            cause: error,
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
          cause: error,
        });
      }
    }),

  getUser: publicProcedure.query(
    async ({ input }): Promise<UserType | null> => {
      const value = await isLoggedIn();

      if (!value.isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not logged in",
        });
      }

      try {
        const user = await UserModel.findOne({ address: value.address });
        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get user",
          cause: error,
        });
      }
    },
  ),
});
