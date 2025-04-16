import { IResponse } from "pec/types/response";
import { UserModel } from "../database/models";
import { isLoggedIn } from "../wallet/auth";
import { User } from "../database/classes/user";

const findOrCreateUser = async (address: string) => {
  const user = await UserModel.findOne({ address });

  if (user) return user;

  const createdUser = await UserModel.create({
    address,
  });

  return createdUser;
};

export const getLoggedInUserOrCreate = async (): Promise<IResponse<User>> => {
  const value = await isLoggedIn();

  if (!value.success) {
    return value;
  }

  // Use the returned address on the JWT
  const existingUser = await findOrCreateUser(value.data.address);

  return {
    success: true,
    data: existingUser,
  };
};
