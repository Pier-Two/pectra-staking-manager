import { BottomBar } from "pec/components/layout/BottomBar";
import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const NarrowLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col">
        <TopBar numberOfValidators={4} type={"profile"} />
        <div className="flex flex-1 justify-center bg-gray-100 dark:bg-gray-950 dark:text-white">
          <div className="w-[55vw] py-8">{children}</div>
        </div>
        <BottomBar />
      </div>
    </ThemeProvider>
  );
};

export default NarrowLayout;
