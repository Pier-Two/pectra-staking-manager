import { z } from "zod";

export const CreateContactSchema = z.object({
  emailAddress: z.string(),
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  companyName: z.string().optional(),
});

export type CreateContactType = z.infer<typeof CreateContactSchema>;

export const SendEmailNotificationSchema = z.object({
  emailName: z.enum([
    "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
    "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
    "PECTRA_STAKING_MANAGER_DEPLOYMENT_COMPLETE",
  ]),
  metadata: z.record(z.unknown()),
});

export type SendEmailNotificationType = z.infer<
  typeof SendEmailNotificationSchema
>;
