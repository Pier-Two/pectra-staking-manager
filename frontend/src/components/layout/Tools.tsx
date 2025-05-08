"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "pec/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cardPresets } from "../dashboard/tools/ToolCard";

export const Tools = () => {
  const router = useRouter();

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <div className="items-center font-inter transition-colors duration-200 hover:cursor-pointer hover:text-zinc-500 dark:text-zinc-50 dark:hover:text-zinc-400">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-1 [&[data-state=open]]:text-zinc-500 [&[data-state=open]]:dark:text-zinc-400">
            <p>Tools</p>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2 max-w-[385px] rounded-xl">
          <div className="flex flex-col">
            {Object.entries(cardPresets).map(([key, preset]) => (
              <DropdownMenuItem className="focus:bg-transparent" key={key}>
                <div
                  className="hover:bg-activeCard group flex flex-col gap-2 rounded-xl p-4 transition-colors hover:cursor-pointer"
                  onClick={() => handleNavigation(preset.url)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-primary-dark dark:text-indigo-200 ${preset.iconHover}`}
                    >
                      {preset.icon}
                    </div>
                    <div className="text-lg font-semibold text-primary-dark group-hover:text-white dark:text-indigo-200">
                      {preset.title}
                    </div>
                  </div>
                  <div className="text-sm font-light leading-4 text-zinc-800 group-hover:text-white dark:text-zinc-200">
                    {preset.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
