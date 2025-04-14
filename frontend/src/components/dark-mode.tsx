"use client";

import { useTheme } from "pec/hooks/useTheme";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      className={`rounded-full border ${
        darkMode
          ? "border-gray-700 dark:bg-black dark:hover:bg-gray-900"
          : "border-indigo-400 bg-gray-100 hover:bg-gray-200"
      } p-3`}
      onClick={toggleDarkMode}
    >
      {darkMode ? (
        <Sun className="text-white" />
      ) : (
        <Moon className="text-gray-700" />
      )}
    </Button>
  );
};

export default DarkMode;
