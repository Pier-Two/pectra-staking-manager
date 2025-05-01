import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { AppSidebar } from "pec/components/app-sidebar";
import { SidebarProvider } from "pec/components/ui/sidebar";
import { Toaster } from "pec/components/ui/sonner";
import { NetworkContextProvider } from "pec/contexts/NetworkContext";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import { cn } from "pec/lib/utils";
import "pec/styles/globals.css";
import { TRPCReactProvider } from "pec/trpc/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Author } from "next/dist/lib/metadata/types/metadata-types";

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
  authors: [
    { name: "Labrys", url: "https://labrys.io" },
    {
      name: "Pier Two",
      url: "https://piertwo.com/",
    },
  ],
  keywords: ["Pectra", "Staking", "Manager", "Ethereum", "Validator"],
  openGraph: {
    siteName: "Pectra Staking Manager",
    authors: ["https://labrys.io", "https://piertwo.com/"],
  },
  twitter: {
    site: "@Labrys_io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(sans.variable, inter.variable)}>
      <GoogleAnalytics gaId="G-34ZMX7ZL6X" />
      <Analytics />
      <SpeedInsights />
      <NetworkContextProvider>
        <TRPCReactProvider>
          <ThemeProvider>
            <body className="bg-indigo-50 dark:bg-gray-950">
              <SidebarProvider>
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
