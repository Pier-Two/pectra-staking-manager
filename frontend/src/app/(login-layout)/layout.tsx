import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const LoginLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col bg-indigo-50 pt-20 dark:bg-gray-950">
        <TopBar />

        <div className="flex flex-1 justify-center">
          <div className="m-4 w-full py-8">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginLayout;
