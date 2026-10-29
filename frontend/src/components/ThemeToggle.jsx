import React from "react";
import { Sun, Moon } from "lucide-react";
import useTheme from "../context/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to warm midnight dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to warm midnight mode"}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer select-none
        ${
          isDark
            ? "bg-[#161838] text-amber-300 border border-purple-500/30 hover:border-purple-400/50 hover:bg-[#1f224d] shadow-sm shadow-purple-500/10"
            : "bg-white text-gray-600 border border-gray-200 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200 shadow-sm"
        }
        ${className}
      `}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon
            size={18}
            className="transition-transform duration-300 rotate-0 scale-100 text-amber-300"
            strokeWidth={2.2}
          />
        ) : (
          <Sun
            size={18}
            className="transition-transform duration-300 rotate-0 scale-100 text-amber-500"
            strokeWidth={2.2}
          />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
