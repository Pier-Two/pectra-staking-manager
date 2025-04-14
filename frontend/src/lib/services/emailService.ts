import axios from "axios";
import { env } from "pec/env";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "../utils";

export const createContact = async (email: string): Promise<IResponse> => {
  try {
    // TODO: What is schema here for passing first name last name and company name
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
  email: string,
): Promise<IResponse> => {
  try {
    const payload = {
      properties: {
        emailName: email,
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
