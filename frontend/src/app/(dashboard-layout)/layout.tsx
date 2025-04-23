import { BottomBar } from "pec/components/layout/BottomBar";
import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const DashboardLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col">
        <TopBar type="profile" />
        <div className="flex flex-1 justify-center bg-gray-50 dark:bg-black dark:text-white">
          <div className="w-full pb-8">{children}</div>
        </div>
      </div>
      <BottomBar />
    </ThemeProvider>
  );
};

export default DashboardLayout;
