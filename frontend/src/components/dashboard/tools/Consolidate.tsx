import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "pec/components/ui/card";
import { CircleAlert, Merge } from "lucide-react";
import { Separator } from "pec/components/ui/separator";
import { Button } from "pec/components/ui/button";

export const Consolidate: FC = () => {
  return (
    <Card className="space-y-4 rounded-xl border bg-white p-3 dark:border-gray-800 dark:bg-black hover:border-yellow-400 hover:border-3 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-8 min-h-[15vh] flex-shrink-0">
        <Merge className="rotate-90 hover:text-yellow-500" size={70} />
        <div className="flex flex-col gap-2">
          <CardTitle>Consolidate</CardTitle>
          <CardDescription className="text-gray-500">
            Combine multiple Pectra validators (0x02 credentials) into one
            large-balance validator.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <CardContent className="flex flex-grow items-center justify-between gap-8 text-sm">
        <div className="flex flex-row items-center gap-x-2">
          <CircleAlert className="text-yellow-500" />

          <div className="text-gray-700 dark:text-white">
            XXX validators not on Pectra standard
          </div>
        </div>

        <Button className="rounded-lg border bg-gray-100 p-3 hover:bg-gray-200 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900">
          Fix
        </Button>
      </CardContent>
    </Card>
  );
};
