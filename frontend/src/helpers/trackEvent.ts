import { track } from "@vercel/analytics/react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * Track an event with Vercel Analytics and Google Analytics
 * @param event - The event name
 * @param data - The event data
 */
export const trackEvent = (
  event: string,
  data?: Parameters<typeof track>[1],
) => {
  track(event, data);

  // split depending on data to make typescript happy
  if (data) {
    sendGAEvent("event", event, data);
  } else {
    sendGAEvent("event", event);
  }
};
