import type { FC } from "react";
import { Card, CardContent, CardHeader } from "pec/components/ui/card";
import { AlignLeft, CircleDollarSign } from "lucide-react";

export const TotalDailyIncome: FC = () => {
  return (
    <Card className="space-y-4 rounded-xl border bg-white p-1 dark:border-gray-800 dark:bg-black">
      <CardHeader className="flex flex-row items-center justify-between gap-8">
        <div className="text-gray-700 dark:text-white">Total Daily Income</div>
        <CircleDollarSign />
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <AlignLeft />
          <div className="text-xl font-bold text-gray-700 dark:text-white">
            XXX
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-white">
          Earning XXX per day
        </div>
      </CardContent>
    </Card>
  );
};
