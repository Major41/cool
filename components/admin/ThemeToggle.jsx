"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button"; // adjust path if needed
import { useTheme } from "@/contexts/ThemeContext"; // adjust to match your folder structure

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 hover:bg-[#b51c1c]/10 transition-colors"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-[#111827]" />
      ) : (
        <Sun className="h-4 w-4 text-[#b51c1c]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
