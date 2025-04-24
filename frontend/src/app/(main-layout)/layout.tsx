import { BottomBar } from "pec/components/layout/BottomBar";
import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const MainLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col items-center bg-indigo-50 dark:bg-gray-950 dark:text-white">
        <TopBar type="profile" />
        <div className="flex w-full max-w-[100rem] flex-1 justify-center px-2 py-8 md:px-8">
          {children}
        </div>
      </div>
      <BottomBar />
    </ThemeProvider>
  );
};

export default MainLayout;
