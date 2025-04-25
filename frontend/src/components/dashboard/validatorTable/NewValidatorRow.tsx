import {
  CircleCheck,
  CircleMinus,
  CirclePlay,
  OctagonMinus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import type { FC } from "react";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { IHeaderConfig } from "pec/types/validatorTable";
import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";

export interface IValidatorRowProps<T extends ValidatorDetails> {
  validator: ValidatorDetails;
  headers: IHeaderConfig[];
  endContent?: React.ReactNode;
}

/**
 * @Description This is a component that renders a row of a validator in the validator table.
 *
 * @param_validator - The validator object to render
 * @param_headers - The headers configuration for the table
 * @param_filterTableOptions - The current filter Options for the table
 *   - Expected Functionality if an item is in the FilterTablesOptions array, ** IT SHOULD NOT BE RENDERED **
 */
export const NewValidatorRow: FC<IValidatorRowProps> = ({
  validator,
  headers,
  endContent,
}) => {
  const displayBalance = displayedEthAmount(validator.balance);

  // Render cell content based on field key
  const renderCellContent = (key: keyof ValidatorDetails) => {
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
              <div className="font-medium">{validator.validatorIndex}</div>
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
            <div className="font-semibold">
              {validator.withdrawalAddress.slice(0, 4)}
            </div>
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
        return <div className="font-semibold">Ξ {displayBalance} ETH</div>;

      default:
        // Fallback for any other fields
        return <div>{String(validator[key])}</div>;
    }
  };

  return (
    <ValidatorCardWrapper
      withBackground
      className="rounded-xl text-left md:table-row"
      as="tr"
    >
      {/* Desktop View - Table Row */}
      {headers.map((header) => {
        const key = header.sortKey;

        return (
          <th key={key} className="px-4 py-2">
            {renderCellContent(key)}
          </th>
        );
      })}
      {endContent && (
        <th className="px-4 py-2">
          <div className="flex justify-end">{endContent}</div>
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
