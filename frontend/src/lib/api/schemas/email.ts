import { z } from "zod";

import { EMAIL_NAMES } from "pec/constants/email";

export const SendEmailNotificationSchema = z.object({
  emailName: z.enum(EMAIL_NAMES),
  metadata: z.record(z.unknown()),
});

export type SendEmailNotificationType = z.infer<
  typeof SendEmailNotificationSchema
>;

export const EmailSchema = z.string().email().optional().or(z.literal(""));
