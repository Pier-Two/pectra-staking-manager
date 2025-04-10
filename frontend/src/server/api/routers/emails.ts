import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { createContact } from "pec/lib/services/emailService";
import { CreateContactSchema } from "pec/lib/api/schemas/email";

export const emailRouter = createTRPCRouter({
  createContact: publicProcedure
    .input(CreateContactSchema)
    .mutation(async ({ input }) => {
      return createContact(input);
    }),
});
