import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "pec/components/ui/card";
import { Separator } from "pec/components/ui/separator";
import { AlignLeft, ArrowDownToDot } from "lucide-react";

export const BatchDeposit: FC = () => {
  return (
    <Card className="hover:border-3 space-y-4 rounded-xl border bg-white p-3 hover:border-blue-400 dark:border-gray-800 dark:bg-black dark:hover:border-blue-400 hover:cursor-pointer flex flex-col">
      <CardHeader className="flex min-h-[15vh] flex-row items-center justify-center gap-8 flex-shrink-0">
        <ArrowDownToDot className="hover:text-blue-400" size={70} />
        <div className="flex flex-col gap-2">
          <CardTitle>Batch Deposit</CardTitle>
          <CardDescription className="text-gray-500">
            Deposit to multiple active validators at once, via PierTwo&apos;s
            batch deposit contract.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <CardContent className="flex flex-grow items-center justify-between gap-8 text-sm">
        <div className="text-gray-700 dark:text-white">
          Available to deposit
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
