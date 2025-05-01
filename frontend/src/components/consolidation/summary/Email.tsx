"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import { Input } from "pec/components/ui/input";
import { Switch } from "pec/components/ui/switch";
import { type DepositType } from "pec/lib/api/schemas/deposit";
import { type FC } from "react";
import { type FieldErrors } from "react-hook-form";

export interface IConsolidationEmail {
  cardText: string;
  cardTitle: string;
  summaryEmail: string;
  setSummaryEmail: (email: string) => void;
  errors?: FieldErrors<DepositType>;
  showEmail: boolean;
  setShowEmail: (showEmail: boolean) => void;
}

export const Email: FC<IConsolidationEmail> = (props) => {
  const {
    cardText,
    cardTitle,
    summaryEmail,
    setSummaryEmail,
    errors,
    showEmail,
    setShowEmail,
  } = props;

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

        <Switch
          checked={showEmail}
          onCheckedChange={() => setShowEmail(!showEmail)}
          className="relative items-center rounded-full transition-colors before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:duration-300 data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-border data-[state=checked]:before:translate-x-5 data-[state=unchecked]:before:translate-x-0 data-[state=unchecked]:dark:bg-gray-600"
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
                value={summaryEmail || ""}
                onChange={(e) => setSummaryEmail(e.target.value)}
                autoFocusOn={showEmail}
              />

              <motion.div
                className="mt-1 text-xs text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: errors?.email ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors?.email && "Invalid email address"}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
