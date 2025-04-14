"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import { Button } from "./ui/button";

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      className={`rounded-full border ${
        darkMode
          ? "border-gray-700 dark:bg-black dark:hover:bg-gray-900"
          : "border-primary/30 bg-gray-100 hover:bg-gray-200"
      } p-3`}
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
