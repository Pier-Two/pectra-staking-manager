import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { UserSchema, type UserType } from "pec/lib/api/schemas/database/user";
import { UserModel } from "pec/lib/database/models";
import { createContact } from "pec/lib/services/emailService";
import { isLoggedIn } from "pec/lib/wallet/auth";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "pec/lib/utils";
import { getLoggedInUserOrCreate } from "pec/lib/server/user";

export const userRouter = createTRPCRouter({
  createOrUpdateUser: publicProcedure
    .input(UserSchema)
    .mutation(async ({ input: rawInput }): Promise<IResponse<null>> => {
      try {
        const parsedInput = UserSchema.safeParse(rawInput);
        if (!parsedInput.success) {
          return generateErrorResponse(parsedInput.error, "Invalid input");
        }

        // Use the returned address on the JWT
        const userResponse = await getLoggedInUserOrCreate();

        if (!userResponse.success) {
          return userResponse;
        }

        if (!userResponse.data.email && parsedInput.data.email) {
          await createContact(parsedInput.data.email);
        }

        const { data: input } = parsedInput;

        await UserModel.updateOne(
          { address: userResponse.data.address },
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
    try {
      return await getLoggedInUserOrCreate();
    } catch (error) {
      return generateErrorResponse(error);
    }
  }),
});
