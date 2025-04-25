import { useRouter } from "next/navigation";

export const ValidatorRowEndContent = () => {
  const router = useRouter();

  const handleDepositNavigation = () => {
    router.push("/batch-deposit");
  };

  const handleWithdrawalNavigation = () => {
    router.push("/withdraw");
  };

  const handleBeaconscanNavigation = () => {
    window.open(
      `https://beaconscan.com/validator/${validator.validatorIndex}`,
      "_blank",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4 rotate-90" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="space-y-2 rounded-xl bg-white p-2 dark:border-gray-500 dark:bg-gray-900 dark:text-white"
        align="end"
      >
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100"
          onClick={handleDepositNavigation}
        >
          <ArrowDownToDot className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
          Deposit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100"
          onClick={handleWithdrawalNavigation}
        >
          <ArrowUpFromDot className="h-4 w-4 text-green-500 dark:text-green-300" />
          Withdraw
        </DropdownMenuItem>
        <Separator className="bg-gray-200 dark:bg-gray-800" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100"
          onClick={handleBeaconscanNavigation}
        >
          View on Beaconscan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
