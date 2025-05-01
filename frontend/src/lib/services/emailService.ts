import type { IResponse } from "pec/types/response";
import { type EmailNames } from "pec/types/emails";

import { generateErrorResponse } from "../utils";
import hubspotApi from "./hubspot-api";

export const createContact = async (email: string): Promise<IResponse> => {
  try {
    const payload = {
      emailAddress: email,
    };

    await hubspotApi.post("/contacts", payload);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error creating contact");
  }
};

export const sendEmailNotification = async (
  emailName: EmailNames,
  email: string,
): Promise<IResponse> => {
  try {
    const payload = {
      emailName,
      metadata: {
        emailAddress: email,
      },
    };

    await hubspotApi.post("/email", payload);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error sending email notification");
  }
};
