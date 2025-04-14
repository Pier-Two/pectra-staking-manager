import axios from "axios";
import { env } from "pec/env";
import type { IResponse } from "pec/types/response";
import {
  CreateContactSchema,
  type CreateContactType,
  SendEmailNotificationSchema,
  type SendEmailNotificationType,
} from "../api/schemas/email";
import { generateErrorResponse } from "../utils";

export const createContact = async (
  input: CreateContactType,
): Promise<IResponse> => {
  try {
    const parsedInput = CreateContactSchema.parse(input);
    const { emailAddress } = parsedInput;

    const payload = {
      properties: {
        emailAddress,
      },
    };

    const response = await axios.post(
      "https://gw-1.api.piertwo.io/integrations/hubspot/contacts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error creating contact");
  }
};

export const sendEmailNotification = async (
  input: SendEmailNotificationType,
): Promise<IResponse> => {
  try {
    const parsedInput = SendEmailNotificationSchema.parse(input);

    const payload = {
      properties: {
        emailName: parsedInput.emailName,
        metadata: parsedInput.metadata,
      },
    };

    const response = await axios.post(
      "https://gw-1.api.piertwo.io/integrations/hubspot/email",
      payload,
      {
        headers: {
          Authorization: `Bearer ${env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      // TODO: Type response
      data: response.data,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error sending email notification");
  }
};
