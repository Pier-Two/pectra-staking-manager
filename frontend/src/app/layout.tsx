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
  title: "Pectra Staking Manager",
  description: "Pectra Staking Manager",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(sans.variable, inter.variable)}>
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
