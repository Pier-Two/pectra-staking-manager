import { Pencil } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { EIconPosition } from "pec/types/components";
import { Email, type EmailFormData, emailSchema } from "./Email";
import { Overview } from "./Overview";
import { type ValidatorDetails } from "pec/types/validator";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ConsolidationSummaryProps {
  goBack: () => void;
  goToSubmit: () => void;
  reset: () => void;
  destinationValidator: ValidatorDetails;
  sourceValidators: ValidatorDetails[];
  upgradeTransactions: number;
  consolidationTransactions: number;
  email: string;
  setEmail: (email: string) => void;
}

export const ConsolidationSummary = ({
  destinationValidator,
  sourceValidators,
  upgradeTransactions,
  consolidationTransactions,
  goBack,
  goToSubmit,
  reset,
  email,
  setEmail,
}: ConsolidationSummaryProps) => {
  const form = useForm<EmailFormData>({
    defaultValues: {
      email: email,
      showEmail: false,
    },
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    setEmail(data.email ?? "");
    goToSubmit();
  });

  return (
    <div className="space-y-8">
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <div className="space-y-6">
            <div className="text-2xl font-medium">Consolidation Summary</div>

            <div className="text-base">
              Review and submit your consolidation request.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="text-md font-medium">Destination validator</div>

              <div className="flex flex-col items-center justify-center gap-4">
                <ValidatorCard validator={destinationValidator} />

                <SecondaryButton
                  className="w-full"
                  label="Change destination"
                  icon={<Pencil className="h-4 w-4" />}
                  iconPosition={EIconPosition.LEFT}
                  onClick={() => reset()}
                  disabled={false}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-md font-medium">Source validators</div>
            <DetectedValidators
              cardTitle="selected"
              validators={sourceValidators}
            />

            <SecondaryButton
              className="w-full"
              label="Change source"
              icon={<Pencil className="h-4 w-4" />}
              iconPosition={EIconPosition.LEFT}
              onClick={goBack}
              disabled={false}
            />
          </div>

          <div className="space-y-2">
            <div className="text-base font-medium">Summary</div>
            <Overview
              sourceValidators={sourceValidators}
              destinationValidator={destinationValidator}
              upgradeTransactions={upgradeTransactions}
              consolidationTransactions={consolidationTransactions}
            />

            <Email
              cardText="Add your email to receive an email when your consolidation is complete."
              cardTitle="Notify me when complete"
            />
          </div>

          <div className="space-y-2">
            <PrimaryButton
              className="w-full"
              label="Generate transactions"
              type="submit"
              disabled={false}
            />

            <div className="text-center text-sm text-zinc-700 dark:text-zinc-300">
              <div>
                <p>
                  You will be required to submit{" "}
                  {upgradeTransactions + consolidationTransactions}{" "}
                  transactions.
                </p>

                {upgradeTransactions > 0 && (
                  <p className="text-xs">
                    ({upgradeTransactions}{" "}
                    {upgradeTransactions > 1
                      ? "transactions are "
                      : "transaction is "}{" "}
                    required to upgrade your validators to version 0x02)
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
