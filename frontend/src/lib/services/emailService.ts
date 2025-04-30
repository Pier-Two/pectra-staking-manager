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

/**
 * Sends an email notification using HubSpot.
 * If the email address is empty or undefined, the function returns early.
 *
 * @param {EmailNames} emailName - The name of the email template to be used.
 * @param {string | undefined} email - The email address to send the notification to.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
export const sendEmailNotification = async (
  emailName: EmailNames,
  email: string | undefined,
): Promise<void> => {
  if (!email || email.length === 0) return;

  try {
    const payload = {
      emailName,
      metadata: {
        emailAddress: email,
      },
    };

    await hubspotApi.post("/email", payload);
  } catch (error) {
    console.error(
      `Failed to send email notification for ${email}: ${parseError(error)}`,
    );
  }
};
