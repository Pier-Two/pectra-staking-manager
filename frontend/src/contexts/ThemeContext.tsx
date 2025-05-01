"use client";

import { createContext, useEffect, useState, type FC } from "react";
import { EThemeMode, type IThemeContext } from "pec/types/theme";
import type { ChildrenProp } from "pec/types/app";

export const ThemeContext = createContext<IThemeContext>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: FC<ChildrenProp> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === EThemeMode.DARK) {
      setDarkMode(true);
      document.documentElement.classList.add(EThemeMode.DARK);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add(EThemeMode.DARK);
      localStorage.setItem("theme", EThemeMode.DARK);
    } else {
      document.documentElement.classList.remove(EThemeMode.DARK);
      localStorage.setItem("theme", EThemeMode.LIGHT);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
