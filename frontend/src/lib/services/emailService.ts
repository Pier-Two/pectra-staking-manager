import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "../utils";
import { type EmailNames } from "pec/types/emails";
import hubspotApi from "./hubspot-api";
import { parseError } from "../utils/parseError";

/**
 * Creates a contact in HubSpot using the provided email address.
 * If the email address is empty or undefined, the function returns early.
 *
 * @param {string | undefined} email - The email address of the contact to be created.
 * @returns {Promise<void>} - A promise that resolves when the contact is created.
 */
export const createContact = async (
  email: string | undefined,
): Promise<void> => {
  if (!email || email.length === 0) return;

  try {
    const payload = {
      emailAddress: email,
    };

    await hubspotApi.post("/contacts", payload);
  } catch (error) {
    console.error(
      `Failed to create contact for ${email}: ${parseError(error)}`,
    );
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
