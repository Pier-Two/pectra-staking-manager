"use server";

import axios from "axios";
import { env } from "pec/env";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "../utils";
import { type EmailNames } from "pec/types/emails";

export const createContact = async (email: string): Promise<IResponse> => {
  try {
    const payload = {
      emailAddress: email,
    };

    await axios.post(
      "https://gw-1.api.piertwo.io/integrations/hubspot/contacts",
      payload,
      {
        headers: {
          "api-key": env.HUBSPOT_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

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

    await axios.post(
      "https://gw-1.api.piertwo.io/integrations/hubspot/email",
      payload,
      {
        headers: {
          "api-key": env.HUBSPOT_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error, "Error sending email notification");
  }
};
