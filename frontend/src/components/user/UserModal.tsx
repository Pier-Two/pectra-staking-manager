import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, type User } from "pec/lib/api/schemas/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "pec/components/ui/dialog";
import { Input } from "pec/components/ui/input";
import { Label } from "pec/components/ui/label";
import { PrimaryButton } from "../ui/custom/PrimaryButton";
import { api } from "pec/trpc/react";

interface IUserModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export const UserModal: FC<IUserModal> = ({
  open,
  setOpen,
  address,
  email,
  firstName,
  lastName,
  companyName,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      address: address,
      email: email,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
    },
    mode: "onChange",
  });

  const { mutate: createOrUpdateUser } =
    api.users.createOrUpdateUser.useMutation();

  const onSubmit = (data: User) => {
    // ETH signature validation logic for Ben needed here first
    const response = createOrUpdateUser({
      ...data,
      address,
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!rounded-xl bg-white text-black shadow-xl dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Enter User Details
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-700 dark:text-gray-300">
            Please enter your details below in order to be notified via email
            for all your transactions on the site.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="px-2" htmlFor="email">
              Email
            </Label>

            <Input
              className="rounded-xl"
              id="email"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className="px-2" htmlFor="firstName">
              First Name (optional)
            </Label>

            <Input
              className="rounded-xl"
              id="firstName"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label className="px-2" htmlFor="lastName">
              Last Name (optional)
            </Label>

            <Input
              className="rounded-xl"
              id="lastName"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Label className="px-2" htmlFor="companyName">
              Company Name (optional)
            </Label>

            <Input
              className="rounded-xl"
              id="companyName"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <PrimaryButton
              className="mx-auto w-[90%]"
              disabled={!isValid}
              label="Submit"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
