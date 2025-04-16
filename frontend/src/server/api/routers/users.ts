import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { UserSchema, type UserType } from "pec/lib/api/schemas/database/user";
import { UserModel } from "pec/lib/database/models";
import { createContact } from "pec/lib/services/emailService";
import { isLoggedIn } from "pec/lib/wallet/auth";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "pec/lib/utils";

const findOrCreateUser = async (address: string) => {
  const user = await UserModel.findOne({ address });

  if (user) return user;

  const createdUser = await UserModel.create({
    address,
  });

  return createdUser;
};

export const userRouter = createTRPCRouter({
  createOrUpdateUser: publicProcedure
    .input(UserSchema)
    .mutation(async ({ input: rawInput }): Promise<IResponse<null>> => {
      try {
        const parsedInput = UserSchema.safeParse(rawInput);
        if (!parsedInput.success) {
          return generateErrorResponse(parsedInput.error, "Invalid input");
        }

        const value = await isLoggedIn();

        if (!value.success) {
          return value;
        }

        // Use the returned address on the JWT
        const existingUser = await findOrCreateUser(value.data.address);

        if (!existingUser.email && parsedInput.data.email) {
          // TODO: Pass through fields
          await createContact(parsedInput.data.email);
        }

        const { data: input } = parsedInput;

        await UserModel.updateOne(
          { address: value.data.address },
          {
            $set: {
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              companyName: input.companyName,
            },
          },
        );

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        return generateErrorResponse(error);
      }
    }),

  getUser: publicProcedure.query(async (): Promise<IResponse<UserType>> => {
    const value = await isLoggedIn();
    if (!value.success) return value;

    try {
      const user = await findOrCreateUser(value.data.address);
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return generateErrorResponse(error);
    }
  }),
});
