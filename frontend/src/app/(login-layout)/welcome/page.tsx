import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { Suspense, type FC } from "react";
import { EnterSiteButton } from "./_components/enter-site-button";
import { ChartPrefetch } from "pec/components/charts/ChartPrefetch";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";

const Welcome: FC = async () => {
  return (
    <div className="flex h-full w-full flex-col gap-y-[72px]">
      <div className="flex flex-col gap-y-4">
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <PectraLink />

          <p className="text-center text-[50px] font-670 leading-[54px]">
            <span>This is the Future of</span>
            <span className="md:block"> Ethereum Staking</span>
          </p>
        </div>
      </div>

      <Information />

      <EnterSiteButton />

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Suspense fallback={<ChartSkeleton />}>
            <ChartPrefetch />
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Welcome;
