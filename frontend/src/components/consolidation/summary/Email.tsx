"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Input } from "pec/components/ui/input";
import { Switch } from "pec/components/ui/switch";
import { DepositType } from "pec/lib/api/schemas/deposit";
import { type FC } from "react";
import { FieldErrors } from "react-hook-form";

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
      className="flex w-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-col-2 flex w-full items-center justify-between py-1">
        <div className="flex items-center gap-x-4">
          <Mail className="h-5 w-5 fill-indigo-500 text-gray-200 dark:text-black" />
          <div className="flex-col items-center pt-2">
            <div className="text-sm font-570">{cardTitle}</div>

            <div className="text-xs text-gray-700 dark:text-gray-300">
              {cardText}
            </div>
          </div>
        </div>

        <Switch
          checked={showEmail}
          onCheckedChange={() => {
            setShowEmail(!showEmail);
          }}
          className="relative items-center rounded-full transition-colors before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:duration-300 data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-indigo-200 data-[state=checked]:before:translate-x-5 data-[state=unchecked]:before:translate-x-0 data-[state=unchecked]:dark:bg-gray-600"
        />
      </div>

      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pt-4">
              <Input
                className="w-full rounded-xl border border-indigo-200 bg-white p-4 dark:border-gray-800 dark:bg-black"
                placeholder="Email"
                value={summaryEmail}
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
