"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import { Button } from "./ui/button";

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      className={clsx("rounded-full border",
        darkMode
          ? "border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900"
          : "border-primary/30 bg-white hover:bg-primary/10"
      )}
      onClick={toggleDarkMode}
    >
      {darkMode ? (
        <Sun className="text-white" />
      ) : (
        <Moon className="text-zinc-950" />
      )}
    </Button>
  );
};

export default DarkMode;
