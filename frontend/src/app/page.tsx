import { ChartPrefetch } from "pec/components/charts/ChartPrefetch";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";
import { Footer } from "pec/components/layout/welcome/Footer";
import {
  InformationShield,
  Information,
} from "pec/components/layout/welcome/Information";
import { Suspense, type FC } from "react";
import { EnterSiteButton } from "./_components/enter-site-button";
import { Headline } from "./_components/headline";
import { EnterAnimation } from "./_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";

import { CustomCursor } from "pec/components/custom-cursor";
import { RedirectOnFirstConnect } from "pec/hooks/use-redirect-on-first-connect";
import { TopBar } from "pec/components/layout/TopBar";

const Welcome: FC = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col overflow-x-hidden pt-16 sm:pt-20">
      <TopBar />
      <div className="flex flex-1 justify-center">
        <div className="m-4 w-full py-8">
          <RedirectOnFirstConnect />
          <CustomCursor />

          <div className="flex h-full w-full flex-col gap-y-8 sm:gap-y-[72px]">
            <div className="flex flex-col gap-y-4 px-4 sm:gap-y-[72px]">
              <div className="flex flex-col gap-y-4">
                <div className="flex w-full flex-col items-center justify-center gap-y-4">
                  <Headline />
                </div>
              </div>

              <Information />

              <EnterSiteButton />

              <InformationShield />

              <Footer />
            </div>

            <EnterAnimation delay={welcomeAnimationDelays.chart}>
              <div className="flex w-full flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center justify-center md:w-[55vw]">
                  <Suspense fallback={<ChartSkeleton />}>
                    <ChartPrefetch />
                  </Suspense>
                </div>
              </div>
            </EnterAnimation>

            <div className="flex w-full flex-col items-center justify-center px-4">
              <div className="flex max-w-[967px] flex-col items-center justify-center gap-y-2">
                <p className="text-center text-sm font-570">DISCLAIMER</p>
                <p className="text-center text-sm font-380">
                  The Pectra Staking Manager is a non-custodial, self-directed
                  public good provided for informational and operational
                  convenience only. It facilitates validator-level updates
                  (including credential upgrades to support auto-compounding,
                  withdrawal enablement, and validator consolidation) on a
                  voluntary basis.
                </p>
                <p className="text-center text-sm font-380">
                  Users remain solely responsible for all actions taken using
                  this tool. At no point do we control, access, or direct your
                  validator operations, private keys, or staked ETH. The tool
                  does not constitute the provision of a financial product or
                  service, nor does it imply any ongoing monitoring, custody, or
                  execution functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
