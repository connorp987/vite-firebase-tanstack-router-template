import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  // Get the effective theme (what's actually being displayed)
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
      title={
        effectiveTheme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
    >
      {effectiveTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
