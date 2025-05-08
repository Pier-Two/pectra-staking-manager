import pino, { destination } from "pino";
import pretty from "pino-pretty";

// Have to declare pretty like this, otherwise Next.js will throw an error around transport issues
export const logger = pino(
  pretty({
    colorize: true,
    destination: 1,
  }),
);
