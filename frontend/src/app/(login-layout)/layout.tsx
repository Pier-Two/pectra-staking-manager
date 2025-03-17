import { type FC } from "react";
import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import type { ChildrenProp } from "pec/types/app";
import { ETopBarType } from "pec/types/topbar";

const LoginLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col">
        <TopBar numberOfValidators={4} type={ETopBarType.WALLET_CONNECT} />
        <div className="flex flex-1 justify-center bg-gray-100 dark:bg-gray-950 dark:text-white">
          <div className="w-[60vw] py-8">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginLayout;
