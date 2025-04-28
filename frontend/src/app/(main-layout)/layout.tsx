import { SharedLayout } from "pec/components/layout";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return <SharedLayout type="full">{children}</SharedLayout>;
};

export default MainLayout;
