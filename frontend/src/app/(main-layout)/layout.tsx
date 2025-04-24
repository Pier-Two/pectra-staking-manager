import { SharedLayout } from "pec/components/layout";
import { FULL_WIDTH_STYLE } from "pec/constants/styles";
import { cn } from "pec/lib/utils";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return <SharedLayout type="full">{children}</SharedLayout>;
};

export default MainLayout;
