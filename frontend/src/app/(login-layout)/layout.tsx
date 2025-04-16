import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import { api, HydrateClient } from "pec/trpc/server";
import type { ChildrenProp } from "pec/types/app";
import { type FC } from "react";

const LoginLayout: FC<ChildrenProp> = async (props) => {
  const { children } = props;
  await api.charts.getChartData.prefetch(); // used in ChartContainer.tsx

  return (
    <HydrateClient>
      <ThemeProvider>
        <div className="flex min-h-screen w-screen flex-col">
          <TopBar />

          <div className="flex flex-1 justify-center bg-indigo-50 dark:bg-gray-950 dark:text-white">
            <div className="m-4 w-full py-8">{children}</div>
          </div>
        </div>
      </ThemeProvider>
    </HydrateClient>
  );
};

export default LoginLayout;
