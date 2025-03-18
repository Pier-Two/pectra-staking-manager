"use client";

import { type FC, useState } from "react";
import type { IConsolidationEmail } from "pec/types/consolidation";
import { Mail } from "lucide-react";
import { Switch } from "pec/components/ui/switch";
import { Input } from "pec/components/ui/input";

export const Email: FC<IConsolidationEmail> = (props) => {
  const { cardText } = props;
  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string>("");

  return (
    <div className="flex min-h-[10vh] w-full flex-col items-center justify-between gap-x-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex-col-2 flex w-full items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <div className="flex-col items-center">
            <div className="text-md">{cardText}</div>

            <div className="text-sm text-gray-700 dark:text-gray-300">
              Enter your email to receive notification.
            </div>
          </div>
        </div>

        <Switch color="red" onCheckedChange={() => setShowEmail(!showEmail)} />
      </div>

      {showEmail && (
        <Input
          className="w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black"
          placeholder="Email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
      )}
    </div>
  );
};
