import { EMAIL_NAMES } from "pec/constants/email";
import { z } from "zod";

export const CreateContactSchema = z.object({
  emailAddress: z.string(),
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  companyName: z.string().optional(),
});

export type CreateContactType = z.infer<typeof CreateContactSchema>;

export const SendEmailNotificationSchema = z.object({
  emailName: z.enum(Object.values(EMAIL_NAMES) as [string, ...string[]]),
  metadata: z.record(z.unknown()),
});

export type SendEmailNotificationType = z.infer<
  typeof SendEmailNotificationSchema
>;
