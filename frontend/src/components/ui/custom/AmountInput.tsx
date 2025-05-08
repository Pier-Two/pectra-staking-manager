import { cn } from "pec/lib/utils";
import { Input, type InputProps } from "../input";

interface TableInputFieldProps {
  inputProps: Omit<InputProps, "onClick"> & { onClick?: () => void };
  useMockInput?: boolean;
  prefix?: string;
  error?: string;
  invalidAmount?: boolean;
}

export const AmountInput = ({
  inputProps: { onClick, className, ...rest },
  useMockInput = false,
  error,
  prefix = "Ξ",
  invalidAmount = false,
}: TableInputFieldProps) => {
  if (useMockInput) {
    return (
      <div className="item-center flex w-full flex-col">
        <div className="flex w-full items-center rounded-full border border-border px-4 py-1 dark:border-gray-800">
          {prefix}
          <Input
            className="border-none p-2 text-sm text-gray-700 dark:text-gray-300"
            disabled
            value={0}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="item-center flex w-full flex-col">
      <div
        className={cn(
          "flex h-12 w-full items-center rounded-full border px-4",
          invalidAmount
            ? "border-red-500 dark:border-red-500"
            : "border-border dark:border-gray-800",
        )}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            e.preventDefault();
            onClick();
          }
        }}
      >
        {prefix}
        <Input
          className={cn(
            "border-none p-2 text-sm text-gray-700 dark:text-gray-300",
            onClick && "cursor-pointer",
            className,
          )}
          type="number"
          step="any"
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              e.preventDefault();
              onClick();
            }
          }}
          {...rest}
        />
      </div>

      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  );
};
