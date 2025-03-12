import { BottomBar } from "pec/components/main-layout/BottomBar";
import { TopBar } from "pec/components/main-layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto dark:bg-black dark:text-white">
          {children}
        </div>
        <BottomBar />
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
