import { BottomBar } from "pec/components/main-layout/BottomBar";
import { TopBar } from "pec/components/main-layout/TopBar";
import type { ChildrenProp } from "pec/types/app";
import type { FC } from "react";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <div className="flex min-h-screen w-screen flex-col">
      <TopBar />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomBar />
    </div>
  );
};

export default MainLayout;
