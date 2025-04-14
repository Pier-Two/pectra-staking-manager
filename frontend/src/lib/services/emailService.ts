import axios from "axios";
import { env } from "pec/env";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "../utils";
import { type EmailNames } from "pec/types/emails";
import { type UserType } from "../api/schemas/database/user";

export const createContact = async (email: string): Promise<IResponse> => {
  try {
    const payload = {
      properties: {
        emailAddress: email,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO: TYPES
      data: response.data,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error creating contact");
  }
};

export const sendEmailNotification = async (
  emailName: EmailNames,
  metadata: UserType & { txHash?: string },
): Promise<IResponse> => {
  try {
    const payload = {
      properties: {
        emailName,
        metadata,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: response.data,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error sending email notification");
  }
};
