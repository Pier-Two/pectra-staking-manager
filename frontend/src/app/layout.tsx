import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AppSidebar } from "pec/components/app-sidebar";
import { SidebarProvider } from "pec/components/ui/sidebar";
import { Toaster } from "pec/components/ui/sonner";
import { NetworkContextProvider } from "pec/contexts/NetworkContext";
import { cn } from "pec/lib/utils";
import "pec/styles/globals.css";
import { TRPCReactProvider } from "pec/trpc/react";

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
      <NetworkContextProvider>
        <TRPCReactProvider>
          <body>
            <SidebarProvider>
              <div className="md:hidden">
                <AppSidebar />
              </div>
              <main>{children}</main>
            </SidebarProvider>
            <Toaster />
          </body>
        </TRPCReactProvider>
      </NetworkContextProvider>
    </html>
  );
}
