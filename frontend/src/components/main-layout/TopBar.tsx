"use client";

import type { FC } from "react";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { ChevronDown, Moon, Sun, User } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import type { ITopBar } from "pec/types/topbar";

export const TopBar: FC<ITopBar> = (props) => {
  const { numberOfValidators } = props;
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex h-[8vh] w-full items-center justify-between border-b bg-white px-6 shadow-sm dark:border-gray-600 dark:bg-black">
      <div className="flex items-center space-x-3">
        <Image
          src="/logos/PectraStakingManager.svg"
          alt="Pectra Staking Manager"
          className="h-12 w-12"
          width={48}
          height={48}
        />

        <div>
          <h1 className="text-lg font-semibold dark:text-white">
            Pectra Staking
          </h1>
          <h1 className="text-lg font-semibold dark:text-white">Manager</h1>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="text-gray-700 hover:text-black dark:text-white dark:hover:text-gray-300">
            My Validators
          </div>

          <Button className="rounded-full border bg-gray-100 p-2 text-gray-700 hover:bg-gray-100 hover:text-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300">
            {numberOfValidators}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-gray-700 hover:text-black dark:text-white dark:hover:text-gray-300">
            Tools
          </div>
          <ChevronDown className="text-gray-700 dark:text-white" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          className="rounded-lg border bg-gray-100 p-3 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-900"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-700 dark:text-white" />
          )}
        </Button>

        <Button className="space-x-2 rounded-lg border bg-gray-100 p-4 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-900">
          <User className="text-gray-700 dark:text-white" />
          <div className="text-sm dark:text-white">blinc.eth</div>
          <ChevronDown className="text-gray-700 dark:text-white" />
        </Button>
      </div>
    </header>
  );
};
