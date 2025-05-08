import { SharedLayout } from "pec/components/layout";
import { RedirectWhenDisconnected } from "pec/hooks/use-redirect-when-disconnected";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const NarrowLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <SharedLayout className="w-full max-w-[800px]" type="narrow">
      {/* all children of this layout require being connected to a wallet */}
      <RedirectWhenDisconnected />
      {children}
    </SharedLayout>
  );
};

export default NarrowLayout;
