import { type FC } from "react";

import type { ChildrenProp } from "pec/types/app";
import { SharedLayout } from "pec/components/layout";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return <SharedLayout type="full">{children}</SharedLayout>;
};

export default MainLayout;
