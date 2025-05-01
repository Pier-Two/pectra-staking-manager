import { type FC } from "react";

import type { ChildrenProp } from "pec/types/app";
import { SharedLayout } from "pec/components/layout";
import { NARROW_MAX_WIDTH_STYLE } from "pec/constants/styles";

const NarrowLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <SharedLayout className={NARROW_MAX_WIDTH_STYLE} type="narrow">
      {children}
    </SharedLayout>
  );
};

export default NarrowLayout;
