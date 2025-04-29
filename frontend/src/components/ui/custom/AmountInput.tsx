import { Input, InputProps } from "../input";

interface TableInputFieldProps {
  inputProps: InputProps;
  useMockInput?: boolean;
  prefix?: string;
  error?: string;
}

export const AmountInput = ({
  inputProps,
  useMockInput = false,
  error,
  prefix = "Ξ",
}: TableInputFieldProps) => {
  if (useMockInput) {
    return (
      <div className="item-center flex w-full flex-col">
        <div className="flex w-full items-center rounded-xl border border-indigo-300 px-4 py-1 dark:border-gray-800">
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
      <div className="flex w-full items-center rounded-xl border border-indigo-300 px-4 py-1 dark:border-gray-800">
        {prefix}
        <Input
          className="border-none p-2 text-sm text-gray-700 dark:text-gray-300"
          type="number"
          step="any"
          {...inputProps}
        />
      </div>

      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  );
};
