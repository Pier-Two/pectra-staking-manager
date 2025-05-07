import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { AppSidebar } from "pec/components/app-sidebar";
import { SidebarProvider } from "pec/components/ui/sidebar";
import { Toaster } from "pec/components/ui/sonner";
import { NetworkContextProvider } from "pec/contexts/NetworkContext";
import { cn } from "pec/lib/utils";
import "pec/styles/globals.css";
import { TRPCReactProvider } from "pec/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "pec/components/theme-provider";
import { headers } from "next/headers";
import { CookieConsentBanner } from "pec/components/cookie-consent-banner";

const sans = localFont({
  src: "../fonts/Saans-TRIAL-VF.woff2",
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pectra Staking Manager: This is the Future of Ethereum Staking",
  description:
    "Take control of your validators with the Pectra upgrade! Upgrade to Pextra (0x02), and consolidate multiple validators for easier management, perform batch top-ups to the new max value from 32ETH to 2048ETH, perform withdraws, and monitor the adoption of Pectra via our charts.",
  keywords: ["Pectra", "Staking", "Manager", "Ethereum", "Validator"],
  openGraph: {
    siteName: "Pectra Staking Manager",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const region = (await headers()).get("x-vercel-ip-country");

  return (
    <NetworkContextProvider>
      <TRPCReactProvider>
        <html
          lang="en"
          className={cn(sans.variable, inter.variable)}
          suppressHydrationWarning
        >
          <head>
            <link
              rel="preload"
              href="/cards/backgrounds/WorkflowOption.webp"
              as="image"
              type="image/webp"
            />
          </head>
          <body className="bg-indigo-50 dark:bg-gray-950">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <div className="md:hidden">
                  <AppSidebar />
                </div>
                <main>{children}</main>
              </SidebarProvider>
              <Toaster />
              <CookieConsentBanner region={region} />
              {process.env.NODE_ENV === "production" && (
                <>
                  <Analytics />
                  <SpeedInsights />
                </>
              )}
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </NetworkContextProvider>
  );
}
