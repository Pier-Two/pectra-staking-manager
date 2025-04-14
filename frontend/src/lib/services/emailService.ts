import axios from "axios";
import { env } from "pec/env";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "../utils";
import { EmailNames } from "pec/types/emails";
import { UserType } from "../api/schemas/database/user";

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
      data: response.data,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error creating contact");
  }
};

export const sendEmailNotification = async (
  emailName: EmailNames,
  metadata: UserType & { txHash: string },
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
      data: response.data,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error sending email notification");
  }
};
