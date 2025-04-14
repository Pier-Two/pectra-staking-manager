import { EMAIL_NAMES } from "pec/constants/email";
import { z } from "zod";

export const SendEmailNotificationSchema = z.object({
  emailName: z.enum(EMAIL_NAMES),
  metadata: z.record(z.unknown()),
});

export type SendEmailNotificationType = z.infer<
  typeof SendEmailNotificationSchema
>;
