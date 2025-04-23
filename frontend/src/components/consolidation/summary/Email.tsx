"use client";

import { Mail } from "lucide-react";
import { Input } from "pec/components/ui/input";
import { Switch } from "pec/components/ui/switch";
import type { IConsolidationEmail } from "pec/types/consolidation";
import { type FC, useState } from "react";

export const Email: FC<IConsolidationEmail> = (props) => {
  const { cardText, cardTitle, summaryEmail, setSummaryEmail, errors } = props;
  const [showEmail, setShowEmail] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-x-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex-col-2 flex w-full items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <Mail className="h-5 w-5 fill-indigo-500 text-gray-200 dark:text-black" />
          <div className="flex-col items-center">
            <div className="text-md">{cardTitle}</div>

            <div className="text-sm text-gray-700 dark:text-gray-300">
              {cardText}
            </div>
          </div>
        </div>

        <Switch
          checked={showEmail}
          onCheckedChange={() => {
            setShowEmail(!showEmail);
            setSummaryEmail("");
          }}
          className="relative items-center rounded-full transition-colors before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:duration-300 data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-indigo-200 data-[state=unchecked]:dark:bg-gray-600 data-[state=checked]:before:translate-x-5 data-[state=unchecked]:before:translate-x-0"
        />
      </div>

      {showEmail && (
        <Input
          className="w-full rounded-xl border border-indigo-200 bg-white p-4 dark:border-gray-800 dark:bg-black"
          placeholder="Email"
          value={summaryEmail}
          onChange={(e) => setSummaryEmail(e.target.value)}
        />
      )}

      <div className="mt-1 text-xs text-red-500">
        {errors?.email && "Please enter a valid email address"}
      </div>
    </div>
  );
};
