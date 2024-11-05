import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { ThemeModeToggle } from "../molecules/theme-mode-toggle";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <div className="absolute top-3 right-3"><ThemeModeToggle /></div>
      {children}
    </NextThemesProvider>
  );
}
