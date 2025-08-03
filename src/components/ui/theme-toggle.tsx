"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-6 h-6 transition-all duration-200"
      aria-label={theme === "light" ? "تغییر به حالت تاریک" : "تغییر به حالت روشن"}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-gray-800" />
      ) : (
        <Sun className="w-5 h-5 text-white" />
      )}
    </button>
  );
} 