import {
  CircleCheck,
  CircleMinus,
  CirclePlay,
  CirclePlus,
  OctagonMinus,
} from "lucide-react";
import Image from "next/image";
import { ValidatorStatus } from "pec/types/validator";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { IHeaderConfig, TableValidatorDetails } from "pec/types/validatorTable";
import {
  ValidatorCardBorderStyles,
  ValidatorCardWrapper,
  ValidatorCardWrapperProps,
} from "pec/components/ui/custom/validator-card-wrapper";
import { cn } from "pec/lib/utils";
import { useState } from "react";
import { SubmittingTransactionTableComponent } from "./TableComponents";

export interface IValidatorRowProps<T extends TableValidatorDetails> {
  wrapperProps?: Omit<ValidatorCardWrapperProps, "onClick" | "children">;
  validator: T;
  headers: IHeaderConfig<T>[];
  endContent?: (data: T) => JSX.Element;
  selectableRows?: {
    onClick: (validator: T) => void;
    isSelected: boolean;
    showCheckIcons: boolean;
  };
  renderOverrides?: Partial<Record<keyof T, (data: T) => JSX.Element>>;
}

export const ValidatorRow = <T extends TableValidatorDetails>({
  validator,
  headers,
  endContent,
  selectableRows,
  wrapperProps,
  renderOverrides,
}: IValidatorRowProps<T>) => {
  const [isHovering, setIsHovering] = useState(false);
  const displayBalance = displayedEthAmount(validator.balance);

  // Render cell content based on field key
  const renderCellContent = (header: IHeaderConfig<T>) => {
    if (renderOverrides?.[header.sortKey]) {
      // Bit of coercian here, but we know the element type is this
      return renderOverrides[header.sortKey]!(validator);
    }

    switch (header.sortKey) {
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

      case "transactionStatus":
        return (
          <SubmittingTransactionTableComponent
            transactionStatus={validator.transactionStatus}
          />
        );

      default:
        // Fallback for any other fields
        return <div>{String(validator[header.sortKey])}</div>;
    }
  };

  const onClick = () => {
    if (!selectableRows?.onClick) return undefined;

    // We create another function here so we can pass the validator to the onClick function
    return () => selectableRows.onClick(validator);
  };

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
        // Apply rounded corners only to first and last cells
        const isFirst = index === 0;
        const isLast = index === headers.length - 1 && !endContent;

        return (
          <th
            key={header.sortKey as string}
            className={cn(
              "bg-inherit px-4 py-2 font-normal",
              {
                border: isHovering && onClick(),
                "!border-l-0": !isFirst,
                "!border-r-0": !isLast,
                "rounded-l-2xl": isFirst,
                "rounded-r-2xl": isLast,
                "hidden md:table-cell": !header.mobile,
              },
              ValidatorCardBorderStyles({
                clearBackground: wrapperProps?.clearBackground,
                isSelected: selectableRows?.isSelected,
                onClick: onClick(),
                isHoveringOverride: isHovering,
              }),
            )}
          >
            <div className="flex items-center gap-x-2">
              {index === 0 && selectableRows?.showCheckIcons && (
                <div className="flex items-center justify-center">
                  {selectableRows.isSelected ? (
                    <>
                      <CircleCheck
                        className={cn(
                          "h-4 min-h-4 w-4 min-w-4 text-green-500",
                          { hidden: isHovering },
                        )}
                      />
                      <CircleMinus
                        className={cn(
                          "hidden h-4 min-h-4 w-4 min-w-4 text-red-500",
                          { block: isHovering },
                        )}
                      />
                    </>
                  ) : (
                    <CirclePlus
                      className={cn("h-4 min-h-4 w-4 min-w-4 text-indigo-500", {
                        "fill-indigo-500 text-white": isHovering,
                      })}
                    />
                  )}
                </div>
              )}
              {renderCellContent(header)}
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
