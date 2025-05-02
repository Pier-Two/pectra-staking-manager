import { CircleMinus, CirclePlay, CirclePlus } from "lucide-react";
import { ValidatorStatus } from "pec/types/validator";
import {
  type IHeaderConfig,
  type TableValidatorDetails,
} from "pec/types/validatorTable";
import {
  ValidatorCardBorderStyles,
  ValidatorCardWrapper,
  type ValidatorCardWrapperProps,
} from "pec/components/ui/custom/validator-card-wrapper";
import { cn } from "pec/lib/utils";
import { useState } from "react";
import {
  DisplayAmount,
  SubmittingTransactionTableComponent,
  ValidatorIndex,
  WithdrawalAddress,
} from "./TableComponents";
import { FaCircleCheck, FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

export interface IValidatorRowProps<T extends TableValidatorDetails> {
  wrapperProps?: Omit<
    ValidatorCardWrapperProps,
    "onClick" | "children" | "ref"
  >;
  validator: T;
  headers: IHeaderConfig<T>[];
  endContent?: (data: T) => JSX.Element;
  selectableRows?: {
    onClick: (validator: T) => void;
    isSelected: boolean;
    showCheckIcons: boolean;
  };
  renderOverrides?: Partial<Record<keyof T, (data: T) => JSX.Element>>;
  index: number;
}

export const ValidatorRow = <T extends TableValidatorDetails>({
  validator,
  headers,
  endContent,
  selectableRows,
  wrapperProps,
  renderOverrides,
  index,
}: IValidatorRowProps<T>) => {
  const [isHovering, setIsHovering] = useState(false);

  // Render cell content based on field key
  const renderCellContent = (header: IHeaderConfig<T>) => {
    if (renderOverrides?.[header.sortKey]) {
      // Bit of coercian here, but we know the element type is this
      return renderOverrides[header.sortKey]!(validator);
    }

    switch (header.sortKey) {
      case "validatorIndex":
        return <ValidatorIndex validator={validator} />;

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
        return <WithdrawalAddress validator={validator} />;

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
        return <DisplayAmount amount={validator.balance} />;

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
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
        delay: index * 0.05,
      }}
    >
      {/* Desktop View - Table Row */}
      {headers.map((header, index) => {
        // Apply rounded corners only to first and last cells
        const isFirst = index === 0;
        const isLast = index === headers.length - 1;

        return (
          <td
            key={header.sortKey as string}
            className={cn(
              "px-4 py-2 font-normal transition-colors duration-200",
              {
                border: isHovering && onClick(),
                "!border-l-0": !isFirst,
                "!border-r-0": !isLast,
                "rounded-l-2xl": isFirst,
                "rounded-r-2xl": isLast,
                "hidden md:table-cell": !header.mobile,
                "bg-white dark:bg-gray-900": !wrapperProps?.clearBackground,
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
                      <FaCircleCheck
                        className={cn(
                          "h-5 min-h-5 w-5 min-w-5 text-green-500 transition-opacity duration-200",
                          { "opacity-0": isHovering },
                        )}
                      />
                      <FaCircleMinus
                        className={cn(
                          "absolute h-5 min-h-5 w-5 min-w-5 text-red-500 transition-opacity duration-200",
                          { "opacity-0": !isHovering },
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <CirclePlus
                        className={cn(
                          "h-5 min-h-5 w-5 min-w-5 text-primary transition-opacity duration-200",
                          { "opacity-0": isHovering },
                        )}
                      />
                      <FaCirclePlus
                        className={cn(
                          "absolute h-5 min-h-5 w-5 min-w-5 text-primary transition-opacity duration-200",
                          { "opacity-0": !isHovering },
                        )}
                      />
                    </>
                  )}
                </div>
              )}
              {renderCellContent(header)}
              {endContent && isLast && (
                <div className="ml-auto flex">{endContent(validator)}</div>
              )}
            </div>
          </td>
        );
      })}
    </ValidatorCardWrapper>
  );
};
