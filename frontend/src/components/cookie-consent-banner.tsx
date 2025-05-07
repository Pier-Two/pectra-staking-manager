"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "pec/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import { euCountryISOCodes } from "pec/constants/eu-countries";
import dynamic from "next/dynamic";

/**
 * Cookie consent banner
 *
 * This component will display a cookie consent banner if the user is not from a EU country.
 * It will also load the Google Analytics script after the user has consented to cookies.
 *
 * @param region - The region of the user returned by Vercel IP Geolocation
 */
export const CookieConsentBanner = ({ region }: { region: string | null }) => {
  const pathname = usePathname();
  const hasMounted = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);

  const [cookieConsent, setCookieConsent] = useLocalStorage<boolean | null>(
    "cookieConsent",
    null,
  );

  useEffect(() => {
    if (hasMounted.current) return;

    setShouldRender(true);

    hasMounted.current = true;
    console.log({ region });
    if (
      !region ||
      region === "US" ||
      euCountryISOCodes.includes(region?.toUpperCase() ?? "")
    ) {
      return;
    }

    setCookieConsent(true);
  }, [cookieConsent, setCookieConsent, region]);

  // don't render anything if the user has rejected cookies or if the component has not mounted (to avoid SSR)
  if (cookieConsent === false || !shouldRender) {
    return null;
  }

  if (cookieConsent === true) {
    // we only want to load the Google Analytics script after the user has consented to cookies
    const GoogleAnalytics = dynamic(
      () =>
        import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
      {
        ssr: false,
      },
    );
    return <GoogleAnalytics gaId="G-NR0EJ12J5G" />;
  }

  return (
    <Card
      className={cn(
        "fixed bottom-36 left-[50%] z-50 w-full max-w-2xl -translate-x-1/2 shadow sm:bottom-16",
        (pathname === "/" || pathname === "") && "bottom-4",
      )}
    >
      <CardHeader>
        <CardTitle>Cookies</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p>
          This website uses cookies to enhance your experience, analyse traffic,
          and support marketing.
        </p>
        <p>
          Non-essential cookies (like analytics and advertising) are only used
          with your consent.
        </p>
        <p>
          Data collected via cookies will be handled in accordance with our{" "}
          <Link
            href="/privacy-policy"
            className="text-indigo-500 dark:text-indigo-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
      <CardFooter className="flex flex-row gap-4">
        <Button
          className="w-full rounded-full"
          onClick={() => setCookieConsent(true)}
        >
          Accept All
        </Button>
        <Button
          className="w-full rounded-full"
          variant="outline"
          onClick={() => setCookieConsent(false)}
        >
          Reject Non-Essential Cookies
        </Button>
      </CardFooter>
    </Card>
  );
};
