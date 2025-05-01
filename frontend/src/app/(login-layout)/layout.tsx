import { TopBar } from "pec/components/layout/TopBar";

import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const LoginLayout: FC<ChildrenProp> = (props) => {
  const { children } = props;

  return (
    <div className="flex min-h-screen w-screen flex-col pt-16 sm:pt-20">
      <TopBar />

      <div className="flex flex-1 justify-center">
        <div className="m-4 w-full py-8">{children}</div>
      </div>
    </div>
  );
};

export default LoginLayout;
