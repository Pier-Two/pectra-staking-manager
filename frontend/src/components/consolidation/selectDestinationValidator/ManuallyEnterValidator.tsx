import { toast } from "pec/components/ui/Toast";
import { useState } from "react";

import { Copy } from "lucide-react";
import { Button } from "pec/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "pec/components/ui/card";
import { Input } from "pec/components/ui/input";
import { Skeleton } from "pec/components/ui/skeleton";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import { api } from "pec/trpc/react";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { type ValidatorDetails } from "pec/types/validator";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";

interface ManuallyEnterValidatorProps {
  goToSelectSourceValidators: (validator: ValidatorDetails) => void;
}

export const ManuallyEnterValidator = ({
  goToSelectSourceValidators,
}: ManuallyEnterValidatorProps) => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>();
  const chain = useActiveChainWithDefault();

  // Validate input (valid index or pub key)
  const isValidInput = (value: string): boolean => {
    // Check if it's a non-zero number
    if (/^[1-9]\d*$/.test(value)) return true;

    // Check if it's a BLS public key (98 chars total, starts with 0x)
    if (/^0x[a-fA-F0-9]{96}$/.test(value)) return true;

    return false;
  };

  const {
    data: validator, // typeof validator === "string" is true if theres an error
    isLoading: isLoadingValidator,
    isError: isErrorGettingValidator,
    error: validatorError,
  } = api.validators.getValidatorDetails.useQuery(
    {
      searchTerm: searchTerm!,
      network: chain.id,
    },
    {
      enabled: !!searchTerm && isValidInput(searchTerm),
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      toast({
        title: "Invalid Selection",
        description: "Please enter a validator index or public key",
        variant: "error",
      });
      return;
    }

    if (!isValidInput(input.trim())) {
      toast({
        title: "Invalid Input",
        description:
          "Please enter either a non-zero number or a public key (48 characters starting with 0x)",
        variant: "error",
      });
      return;
    }

    setSearchTerm(input.trim());
  };

  const handleConfirmValidator = () => {
    if (!validator || typeof validator === "string") return;
    goToSelectSourceValidators(validator);
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <EnterAnimation>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter validator index or public key (0x...)"
            className="flex-1 rounded-full border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
          />
          <PrimaryButton type="submit" label="Search" className="!px-8" />
        </form>

        {searchTerm && (
          <EnterAnimation>
            <Card>
              <CardHeader>
                <CardTitle>Validator Details</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingValidator && (
                  <div className="flex flex-col space-y-4">
                    <Skeleton className="h-12 w-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-12 w-28 rounded-xl bg-gray-200 dark:bg-gray-800" />
                  </div>
                )}

                {(isErrorGettingValidator || typeof validator === "string") && (
                  <div className="text-red-500">{validatorError?.message}</div>
                )}

                {validator && typeof validator !== "string" && (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Validator Index
                      </div>
                      <div className="font-mono text-lg">
                        {validator.validatorIndex}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span>Public Key</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(validator.publicKey)}
                          className="h-8 px-2"
                        >
                          <Copy className="mr-1 h-4 w-4" />
                          <span className="text-xs">
                            {copied ? "Copied!" : "Copy"}
                          </span>
                        </Button>
                      </div>
                      <div className="break-all font-mono text-sm">
                        {validator.publicKey}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Balance
                      </div>
                      <div className="text-lg font-semibold">
                        Ξ {displayedEthAmount(validator.balance)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!isErrorGettingValidator && (
                  <div className="flex w-full flex-col gap-2">
                    <PrimaryButton
                      onClick={handleConfirmValidator}
                      disabled={
                        !validator ||
                        (validator &&
                          !validator.withdrawalAddress.startsWith("0x02"))
                      }
                      label={
                        validator
                          ? `Use ${validator.validatorIndex} as Target Validator`
                          : ""
                      }
                    />

                    {validator &&
                      !validator.withdrawalAddress.startsWith("0x02") && (
                        <p className="w-full text-center text-xs">
                          You can&apos;t set this validator as a consolidation
                          target as it is not the correct validator version.
                          (Expected version 0x02, got{" "}
                          {validator.withdrawalAddress.substring(0, 4)})
                        </p>
                      )}
                  </div>
                )}
              </CardFooter>
            </Card>
          </EnterAnimation>
        )}
      </div>
    </EnterAnimation>
  );
};
