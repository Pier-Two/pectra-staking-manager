"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import { Input } from "pec/components/ui/input";
import { Switch } from "pec/components/ui/switch";
import { type FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export interface IConsolidationEmail {
  cardText: string;
  cardTitle: string;
}

export const emailSchema = z.union([
  z.object({
    showEmail: z.literal(false),
    email: z.string().optional().or(z.literal("")),
  }),
  z.object({
    showEmail: z.literal(true),
    email: z.string().email("Please enter a valid email address"),
  }),
]);

export type EmailFormData = z.infer<typeof emailSchema>;

/**
 * This component inherits the form from the form context.
 * The parent form's schema should have `.and(emailSchema)` so that
 * the types and the validation are correct and should use the FormProvider
 * component to share the form context.
 */
export const Email: FC<IConsolidationEmail> = ({ cardText, cardTitle }) => {
  const {
    register,
    formState: { errors },
    watch,
    control,
  } = useFormContext<EmailFormData>();

  const showEmail = watch("showEmail");

  return (
    <motion.div
      className="flex w-full flex-col items-center justify-between rounded-2xl bg-white p-4 dark:border-gray-800 dark:bg-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-col-2 flex w-full items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <HiMail className="h-5 w-5 fill-primary text-white dark:text-black" />
          <div className="flex-col items-center">
            <div className="text-md font-570">{cardTitle}</div>

            <div className="text-sm text-piertwo-text">{cardText}</div>
          </div>
        </div>

        <Controller
          control={control}
          name="showEmail"
          render={({ field: { onChange, value } }) => (
            <Switch checked={value} onCheckedChange={onChange} />
          )}
        />
      </div>

      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="flex flex-col gap-y-2 pt-4">
              <Input
                className="mt-2 rounded-xl border border-indigo-200 bg-white p-4 dark:border-gray-800 dark:bg-black"
                placeholder="Email"
                {...register("email")}
                autoFocusOn={showEmail}
              />

              <motion.div
                className="mt-1 text-xs text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: errors?.email ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors?.email?.message}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
