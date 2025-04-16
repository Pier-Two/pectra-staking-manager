import { type Metadata } from "next";
import { AppSidebar } from "pec/components/app-sidebar";
import { SidebarProvider } from "pec/components/ui/sidebar";
import { NetworkContextProvider } from "pec/contexts/NetworkContext";
import { cn } from "pec/lib/utils";
import "pec/styles/globals.css";
import { TRPCReactProvider } from "pec/trpc/react";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const saans = localFont({
  src: "../fonts/Saans-TRIAL-VF.woff2",
  variable: "--font-saans",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en" className={cn(saans.variable, inter.variable)}>
      <NetworkContextProvider>
        <TRPCReactProvider>
          <body>
            <SidebarProvider>
              <div className="md:hidden">
                <AppSidebar />
              </div>
              <main>{children}</main>
            </SidebarProvider>
          </body>
        </TRPCReactProvider>
      </NetworkContextProvider>
    </html>
  );
}
