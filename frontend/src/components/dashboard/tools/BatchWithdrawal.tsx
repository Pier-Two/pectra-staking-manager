import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "pec/components/ui/card";
import { Separator } from "pec/components/ui/separator";
import { AlignLeft, ArrowUpFromDot } from "lucide-react";

export const BatchWithdrawal: FC = () => {
  return (
    <Card className="space-y-4 rounded-xl border bg-white p-3 dark:border-gray-800 dark:bg-black hover:border-green-400 hover:border-3 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-8 min-h-[15vh] flex-shrink-0">
        <ArrowUpFromDot className="hover:text-green-400" size={70} />
        <div className="flex flex-col gap-2">
          <CardTitle>Batch Withdrawal</CardTitle>
          <CardDescription className="text-gray-500">
            Submit onchain execution layer withdrawal requests against
            validators, as per Pectra EIP-7002.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <CardContent className="flex flex-grow items-center justify-between gap-8 text-sm">
        <div className="text-gray-700 dark:text-white">
          Available to withdraw
        </div>

        <div className="flex flex-row items-center gap-1">
          <AlignLeft className="h-4 w-4" />
          <div className="text-gray-700 hover:text-black dark:text-white dark:hover:text-gray-300">
            XXX
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
