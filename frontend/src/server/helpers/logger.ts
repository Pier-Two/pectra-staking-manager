// Have to put this in a function to prevent runtime errors in the clientside app
export const getLogger = () => {
  return { info: console.log, error: console.error };
  // // Only use pino-pretty transport on the server side
  // if (typeof window === "undefined") {
  //   return pino({
  //     transport: {
  //       target: "pino-pretty",
  //       options: {
  //         colorize: true,
  //       },
  //     },
  //   });
  // }
  //
  // // Use basic pino configuration for client side
  // return pino({ browser: { asObject: true } });
};
