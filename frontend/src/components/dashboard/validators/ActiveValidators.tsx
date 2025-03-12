import type { FC } from "react";
import { Card, CardContent, CardHeader } from "pec/components/ui/card";
import { CircleDollarSign } from "lucide-react";

export const ActiveValidators: FC = () => {
  return (
    <Card className="space-y-4 rounded-xl border bg-white p-1 dark:border-gray-800 dark:bg-black">
      <CardHeader className="flex flex-row justify-between items-center gap-8">
        <div className="text-gray-700 dark:text-white">Active Validators</div>
        <CircleDollarSign />
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="text-xl font-bold text-gray-700 dark:text-white">XXX</div>
        <div className="text-sm text-gray-500 dark:text-white">
          +XXX inactive
        </div>
      </CardContent>
    </Card>
  );
};
