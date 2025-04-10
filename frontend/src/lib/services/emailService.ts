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

const getHubspotApiKeyResponse = (): IResponse => {
  const hubspotApiKey = env.HUBSPOT_API_KEY;

  if (!hubspotApiKey)
    return {
      success: false,
      message: "Hubspot API key not found",
    };

  return {
    success: true,
    message: "Hubspot API key found",
    data: hubspotApiKey,
  };
};

export const createContact = async (
  input: CreateContactType,
): Promise<IResponse> => {
  try {
    const parsedInput = CreateContactSchema.parse(input);
    const { emailAddress, customerFirstName, customerLastName, companyName } =
      parsedInput;

    const hubspotApiKeyResponse = getHubspotApiKeyResponse();
    if (!hubspotApiKeyResponse.success) return hubspotApiKeyResponse;
    const hubspotApiKey = hubspotApiKeyResponse.data;

    const payload = {
      properties: {
        emailAddress,
        ...(customerFirstName && { customerFirstName }),
        ...(customerLastName && { customerLastName }),
        ...(companyName && { companyName }),
      },
    };

    const response = await axios.post(
      "https://gw-1.api.piertwo.io/integrations/hubspot/contacts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${hubspotApiKey}`,
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

    const hubspotApiKeyResponse = getHubspotApiKeyResponse();
    if (!hubspotApiKeyResponse.success) return hubspotApiKeyResponse;
    const hubspotApiKey = hubspotApiKeyResponse.data;

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
          Authorization: `Bearer ${hubspotApiKey}`,
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
