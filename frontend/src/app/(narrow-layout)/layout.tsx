import { SharedLayout } from "pec/components/layout";
import { NARROW_MAX_WIDTH_STYLE } from "pec/constants/styles";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const NarrowLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <SharedLayout className={NARROW_MAX_WIDTH_STYLE} type="narrow">
      {children}
    </SharedLayout>
  );
};

export default NarrowLayout;
