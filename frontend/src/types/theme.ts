export interface IThemeContext {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export enum EThemeMode {
  LIGHT = "light",
  DARK = "dark",
}
