"use client";

import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { useState } from "react";
import { toast } from "sonner";

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
import { DECIMAL_PLACES } from "pec/lib/constants";
import { api } from "pec/trpc/react";
import { formatEther } from "viem";

export const ManuallyEnterValidator = () => {
  const { setConsolidationTarget, setProgress } = useConsolidationStore();
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>();

  // Validate input (valid index or pub key)
  const isValidInput = (value: string): boolean => {
    // Check if it's a non-zero number
    if (/^[1-9]\d*$/.test(value)) return true;

    // Check if it's a public key (48 chars, starts with 0x)
    if (/^0x[a-fA-F0-9]{96}$/.test(value)) return true;

    return false;
  };

  const {
    data: validator, // typeof validator === "string" is true if theres an error
    isLoading: isLoadingValidator,
    isError: isErrorGettingValidator,
  } = api.validators.getValidatorDetails.useQuery(
    {
      searchTerm: searchTerm!,
    },
    {
      enabled: !!searchTerm && isValidInput(searchTerm),
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Error", {
        description: "Please enter a validator index or public key",
      });
      return;
    }

    if (!isValidInput(input.trim())) {
      toast.error("Invalid Input", {
        description:
          "Please enter either a non-zero number or a public key (48 characters starting with 0x)",
      });
      return;
    }

    setSearchTerm(input.trim());
  };

  const handleConfirmValidator = () => {
    if (!validator || typeof validator === "string") return;
    setConsolidationTarget(validator);
    setProgress(2);
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text); // TODO odd
    toast("Copied!", {
      description: "Public key copied to clipboard",
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter validator index or public key (0x...)"
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>

      {searchTerm && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800">
            <CardTitle>Validator Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingValidator && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            )}

            {(isErrorGettingValidator || typeof validator === "string") && (
              <div className="text-red-500">
                Error loading validator data. Please try again.
              </div>
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
                      <span className="text-xs">Copy</span>
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
                    {Number(formatEther(validator.balance)).toFixed(
                      DECIMAL_PLACES,
                    )}{" "}
                    ETH
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {validator && typeof validator !== "string" && (
              <div className="flex flex-col">
                <Button onClick={handleConfirmValidator}>
                  Use {validator.validatorIndex} as Destination Validator
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
