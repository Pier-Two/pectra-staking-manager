import { BottomBar } from "pec/components/layout/BottomBar";
import { TopBar } from "pec/components/layout/TopBar";
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
    <>
      <div className="flex min-h-screen w-full flex-col items-center pb-36 pt-20">
        <TopBar />
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
    </>
  );
};
