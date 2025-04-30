import { ArrowDownToDot, ArrowUpFromDot, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "pec/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "pec/components/ui/dropdown-menu";
import { cn } from "pec/lib/utils";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorStatus } from "pec/types/validator";

interface ValidatorRowEndContentProps {
  validator: ValidatorDetails;
}

interface DropDownItem {
  label: string;
  icon?: React.ElementType;
  iconClassName?: string;
  onClick: () => void;
  isDisabled?: boolean;
}

export const ValidatorRowEndContent = ({
  validator,
}: ValidatorRowEndContentProps) => {
  const router = useRouter();

  const isDisabled = validator.status === ValidatorStatus.EXITED;

  const dropDownItems: DropDownItem[] = [
    {
      label: "Deposit",
      icon: ArrowDownToDot,
      iconClassName: "text-indigo-500 dark:text-indigo-300",
      onClick: () => router.push("/batch-deposit"),
      isDisabled,
    },
    {
      label: "Withdraw",
      icon: ArrowUpFromDot,
      iconClassName: "text-green-500 dark:text-green-300",
      onClick: () => router.push("/withdraw"),
      isDisabled,
    },
    {
      label: "View on Beaconscan",
      onClick: () => window.open(
        `https://beaconscan.com/validator/${validator.validatorIndex}`,
        "_blank",
      ),
    },
  ];

  return (
    <div className="font-normal">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4 rotate-90" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="z-50 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-500 dark:bg-gray-900"
          align="end"
        >
          {dropDownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className={cn(
                "cursor-pointer flex items-center",
                {
                  "cursor-not-allowed":
                    item.isDisabled,
                },
              )}
              onClick={item.isDisabled ? undefined : item.onClick}
            >
              {item.icon && (
                <item.icon className={cn("h-4 w-4", item.iconClassName)} />
              )}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
