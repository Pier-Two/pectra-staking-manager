import "pec/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Montserrat } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "pec/trpc/react";
import { cn } from "pec/lib/utils";
import { NetworkContextProvider } from "pec/contexts/NetworkContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Pectra Staking Management",
  description: "Pectra Staking Management",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, montserrat.variable)}>
      <body>
        <TRPCReactProvider>
          <NetworkContextProvider>{children}</NetworkContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
