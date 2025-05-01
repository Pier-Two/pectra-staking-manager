import { BottomBar } from "pec/components/layout/BottomBar";
import { TopBar } from "pec/components/layout/TopBar";
import { ThemeProvider } from "pec/contexts/ThemeContext";
import { cn } from "pec/lib/utils";
import { type FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
  type: "full" | "narrow";
  className?: string;
}

export const SharedLayout: FC<LayoutProps> = (props) => {
  const { children, className, type } = props;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col items-center bg-indigo-50 py-20 dark:bg-gray-950">
        <TopBar type="profile" />
        <div
          className={cn(
            "flex w-full flex-1 justify-center px-2 py-6 md:px-8 xl:px-2",
            {
              "max-w-[80rem]": type === "full",
              "max-w-[30rem]": type === "narrow",
            },
            className,
          )}
        >
          {children}
        </div>
      </div>
      <BottomBar />
    </ThemeProvider>
  );
};
