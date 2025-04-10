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
import { z } from "zod";

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
      message: `Contact created successfully: ${response.data}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid input format",
        errors: error.errors.map((e) => e.message),
      };
    }

    if (axios.isAxiosError(error)) {
      console.error("Hubspot API error:", error.response?.data);
      return generateErrorResponse(
        `Error creating contact: ${error.response?.status} ${error.response?.statusText}`,
      );
    }

    console.error("Error creating contact:", error);
    return generateErrorResponse("Error creating contact");
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
      message: `Email notification sent successfully: ${response.data}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid input format",
        errors: error.errors.map((e) => e.message),
      };
    }

    if (axios.isAxiosError(error)) {
      console.error("Hubspot API error:", error.response?.data);
      return generateErrorResponse(
        `Error sending email notification: ${error.response?.status} ${error.response?.statusText}`,
      );
    }

    console.error("Error sending email notification:", error);
    return generateErrorResponse("Error sending email notification");
  }
};
