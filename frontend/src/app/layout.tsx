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
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "pec/components/theme-provider";
import Head from "next/head";
import { RedirectOnFirstConnect } from "pec/hooks/use-redirect-on-first-connect";

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
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  keywords: ["Pectra", "Staking", "Manager", "Ethereum", "Validator"],
  openGraph: {
    siteName: "Pectra Staking Manager",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(sans.variable, inter.variable)}
      suppressHydrationWarning
    >
      <Head>
        <link
          rel="preload"
          href="/cards/backgrounds/WorkflowOption.webp"
          as="image"
          type="image/webp"
        />
      </Head>
      <GoogleAnalytics gaId="G-34ZMX7ZL6X" />
      <Analytics />
      <SpeedInsights />
      <NetworkContextProvider>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <body className="bg-indigo-50 dark:bg-gray-950">
              <SidebarProvider>
                <RedirectOnFirstConnect />
                <div className="md:hidden">
                  <AppSidebar />
                </div>
                <main>{children}</main>
              </SidebarProvider>
              <Toaster />
            </body>
          </ThemeProvider>
        </TRPCReactProvider>
      </NetworkContextProvider>
    </html>
  );
}
