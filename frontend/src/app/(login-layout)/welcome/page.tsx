import { ChartPrefetch } from "pec/components/charts/ChartPrefetch";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { Suspense, type FC } from "react";
import { EnterSiteButton } from "./_components/enter-site-button";
import { Headline } from "./_components/headline";
import { EnterAnimation } from "./_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";

const Welcome: FC = () => {
  return (
    <div className="flex h-full w-full flex-col gap-y-8 px-4 sm:gap-y-[72px]">
      <div className="flex flex-col gap-y-4">
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <Headline />
        </div>
      </div>

      <Information />

      <EnterSiteButton />

      <Footer />

      <EnterAnimation delay={welcomeAnimationDelays.chart}>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Suspense fallback={<ChartSkeleton />}>
              <ChartPrefetch />
            </Suspense>
          </div>
        </div>
      </EnterAnimation>

      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex max-w-[967px] flex-col items-center justify-center gap-y-2">
          <p className="text-center text-sm font-570">DISCLAIMER</p>
          <p className="text-center text-sm font-380">
            The Pectra Staking Manager is a non-custodial, self-directed public
            good provided for informational and operational convenience only. It
            facilitates validator-level updates (including credential upgrades
            to support auto-compounding, withdrawal enablement, and validator
            consolidation) on a voluntary basis.
          </p>
          <p className="text-center text-sm font-380">
            Users remain solely responsible for all actions taken using this
            tool. At no point do we control, access, or direct your validator
            operations, private keys, or staked ETH. The tool does not
            constitute the provision of a financial product or service, nor does
            it imply any ongoing monitoring, custody, or execution
            functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
