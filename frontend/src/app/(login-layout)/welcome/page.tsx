import { ChartPrefetch } from "pec/components/charts/ChartPrefetch";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { Suspense, type FC } from "react";
import { EnterSiteButton } from "./_components/enter-site-button";
import { EnterAnimation } from "./_components/enter-animation";

const Welcome: FC = async () => {
  return (
    <div className="flex h-full w-full flex-col gap-y-[72px]">
      <div className="flex flex-col gap-y-4">
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <EnterAnimation delay={0.4}>
            <PectraLink />
          </EnterAnimation>

          <EnterAnimation>
            <p className="text-center text-[50px] font-670 leading-[54px]">
              <span>This is the Future of</span>
              <span className="md:block"> Ethereum Staking</span>
            </p>
          </EnterAnimation>
        </div>
      </div>

      <EnterAnimation delay={0.4}>
        <Information />
      </EnterAnimation>

      <EnterAnimation delay={1.2}>
        <EnterSiteButton />
      </EnterAnimation>

      <EnterAnimation delay={1.4}>
        <Footer />
      </EnterAnimation>

      <EnterAnimation delay={1.6}>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Suspense fallback={<ChartSkeleton />}>
              <ChartPrefetch />
            </Suspense>
          </div>
        </div>
      </EnterAnimation>

      <EnterAnimation delay={1.8}>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex max-w-[967px] flex-col items-center justify-center gap-y-2">
            <p className="text-center text-[14px] font-570">DISCLAIMER</p>
            <p className="text-center text-[14px] font-380">
              The Pectra Staking Manager is a non-custodial, self-directed
              public good provided for informational and operational convenience
              only. It facilitates validator-level updates (including credential
              upgrades to support auto-compounding, withdrawal enablement, and
              validator consolidation) on a voluntary basis.
            </p>
            <p className="text-center text-[14px] font-380">
              Users remain solely responsible for all actions taken using this
              tool. At no point do we control, access, or direct your validator
              operations, private keys, or staked ETH. The tool does not
              constitute the provision of a financial product or service, nor
              does it imply any ongoing monitoring, custody, or execution
              functionality.*
            </p>
          </div>
        </div>
      </EnterAnimation>
    </div>
  );
};

export default Welcome;
