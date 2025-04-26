import {
  CircleCheck,
  CircleMinus,
  CirclePlay,
  OctagonMinus,
} from "lucide-react";
import Image from "next/image";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { IHeaderConfig } from "pec/types/validatorTable";
import {
  ValidatorCardBorderStyles,
  ValidatorCardWrapper,
  ValidatorCardWrapperProps,
} from "pec/components/ui/custom/validator-card-wrapper";
import { cn } from "pec/lib/utils";
import { useState } from "react";

export interface IValidatorRowProps<T extends ValidatorDetails> {
  wrapperProps?: Omit<ValidatorCardWrapperProps, "onClick" | "children">;
  validator: T;
  headers: IHeaderConfig<T>[];
  endContent?: (data: T) => JSX.Element;
  selectableRows?: {
    onClick: (validator: T) => void;
    isSelected: boolean;
    showCheckIcons: boolean;
  };
}

/**
 * @Description This is a component that renders a row of a validator in the validator table.
 *
 * @param_validator - The validator object to render
 * @param_headers - The headers configuration for the table
 * @param_filterTableOptions - The current filter Options for the table
 *   - Expected Functionality if an item is in the FilterTablesOptions array, ** IT SHOULD NOT BE RENDERED **
 */
export const NewValidatorRow = <T extends ValidatorDetails>({
  validator,
  headers,
  endContent,
  selectableRows,
  wrapperProps,
}: IValidatorRowProps<T>) => {
  const [isHovering, setIsHovering] = useState(false);
  const displayBalance = displayedEthAmount(validator.balance);

  // Render cell content based on field key
  const renderCellContent = (key: keyof T) => {
    switch (key) {
      case "validatorIndex":
        return (
          <div className="flex flex-row gap-2">
            <Image
              src="/icons/EthValidator.svg"
              alt="Wallet"
              width={24}
              height={24}
            />
            <div className="flex flex-col">
              <div>{validator.validatorIndex}</div>
              <div className="text-xs text-gray-500">
                {validator.publicKey.slice(0, 7)}...
                {validator.publicKey.slice(-5)}
              </div>
            </div>
          </div>
        );

      case "activeSince":
        return (
          <div className="flex flex-col">
            <span>{validator.activeSince}</span>
            <span className="text-xs text-gray-500">
              {validator.activeDuration}
            </span>
          </div>
        );

      case "withdrawalAddress":
        return (
          <div className="flex items-center gap-1">
            {validator.withdrawalAddress.includes("0x02") ? (
              <CircleCheck className="h-4 w-4 fill-green-500 text-white dark:text-black" />
            ) : (
              <OctagonMinus className="h-4 w-4 text-gray-500 dark:text-white" />
            )}
            <div>{validator.withdrawalAddress.slice(0, 4)}</div>
          </div>
        );

      case "status":
        return (
          <div className="flex items-center gap-2">
            {validator.status === ValidatorStatus.ACTIVE ? (
              <CirclePlay className="h-4 w-4 fill-green-500 text-white dark:text-black" />
            ) : (
              <CircleMinus className="h-4 w-4 fill-red-500 text-white dark:text-black" />
            )}
            <span>{validator.status}</span>
          </div>
        );

      case "balance":
        return <div className="text-sm">Ξ {displayBalance} ETH</div>;

      default:
        // Fallback for any other fields
        return <div>{String(validator[key])}</div>;
    }
  };

  const onClick = () => {
    if (!selectableRows?.onClick) return undefined;

    // We create another function here so we can pass the validator to the onClick function
    return () => selectableRows.onClick(validator);
  };

  {
    /*   "cursor-pointer hover:!border-indigo-500 dark:hover:!border-gray-600": */
  }
  {
    /*   onClick && !withBackground, */
  }
  {
    /* "hover:!border-indigo-300 dark:hover:!bg-gray-900": onClick && withBackground, */
  }

  return (
    <ValidatorCardWrapper
      {...wrapperProps}
      // We execute the onClick here to build the onClick function, this ensures undefined is still passed correctly if there is no onClick method which then ensures the styles work as expected
      onClick={onClick()}
      className={cn("!mb-4 table-row text-left")}
      as="tr"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Desktop View - Table Row */}
      {headers.map((header, index) => {
        const key = header.sortKey;
        // Apply rounded corners only to first and last cells
        const isFirst = index === 0;
        const isLast = index === headers.length - 1 && !endContent;

        return (
          <th
            key={key as string}
            className={cn(
              "bg-inherit px-4 py-2 font-normal",
              {
                border: isHovering && onClick(),
                "!border-l-0": !isFirst,
                "!border-r-0": !isLast,
                "rounded-l-2xl": isFirst,
                "rounded-r-2xl": isLast,
              },
              ValidatorCardBorderStyles({
                clearBackground: wrapperProps?.clearBackground,
                isSelected: selectableRows?.isSelected,
                onClick: onClick(),
              }),
            )}
          >
            <div className="flex items-center gap-x-2">
              {index === 0 && selectableRows?.showCheckIcons && (
                <div className="flex items-center justify-center">
                  {selectableRows.isSelected ? (
                    <CircleCheck className="h-4 w-4 fill-green-500 text-white dark:text-black" />
                  ) : (
                    <CircleMinus className="h-4 w-4 text-gray-500 dark:text-white" />
                  )}
                </div>
              )}
              {renderCellContent(key)}
            </div>
          </th>
        );
      })}
      {endContent && (
        <th className={cn("rounded-r-xl bg-inherit px-4 py-2")}>
          <div className="flex justify-end">{endContent(validator)}</div>
        </th>
      )}
    </ValidatorCardWrapper>
  );
};

// <div className="md:hidden">
//   <div className="mb-4 grid grid-cols-3 gap-4">
//     <div>{renderCellContent("validatorIndex")}</div>
//     <div>{renderCellContent("withdrawalAddress")}</div>
//     <div className="flex justify-end">
//       <ActionsDropdown />
//     </div>
//   </div>
//
//   {/* Mobile Details Section */}
//   <div className="mt-4 space-y-2 border-t pt-4 dark:border-gray-800">
//     {headers.map((header) => {
//       if (!header.mobile) return;
//
//       const key = header.sortKey;
//       const label = header.label;
//
//       return (
//         <div key={key} className="flex items-center justify-between">
//           <span className="text-gray-500">{label}</span>
//           <div>{renderCellContent(key)}</div>
//         </div>
//       );
//     })}
//   </div>
// </div>;
