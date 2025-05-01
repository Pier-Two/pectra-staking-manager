import hubspotApi from "./hubspot-api";
import { parseError } from "../utils/parseError";
import { type EmailPayload } from "pec/types/emails";

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

/**
 * Sends an email notification using HubSpot.
 * If the email address is empty or undefined, the function returns early.
 *
 * @param {EmailNames} emailPayload - The payload containing the email address and other metadata.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
export const sendEmailNotification = async (
  emailPayload: EmailPayload,
): Promise<void> => {
  if (
    !emailPayload.metadata.emailAddress ||
    emailPayload.metadata.emailAddress.length === 0
  )
    return;

  try {
    await hubspotApi.post("/email", emailPayload);
  } catch (error) {
    console.error(
      `Failed to send email notification with payload ${JSON.stringify(emailPayload)}: ${parseError(error)}`,
    );
  }
};
