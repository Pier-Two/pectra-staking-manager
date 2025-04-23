import { BottomBar } from "pec/components/layout/BottomBar";
import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col">
        <TopBar type="profile" />
        <div className="flex flex-1 justify-center bg-indigo-50 dark:bg-gray-950 dark:text-white">
          <div className="min-h-screen w-full max-w-[90vw] py-8 md:max-w-[42vw]">
            {children}
          </div>
        </div>
        <BottomBar />
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
