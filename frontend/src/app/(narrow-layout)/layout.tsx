import { SharedLayout } from "pec/components/layout";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const NarrowLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <SharedLayout className="w-full max-w-[800px]" type="narrow">
      {children}
    </SharedLayout>
  );
};

export default NarrowLayout;
