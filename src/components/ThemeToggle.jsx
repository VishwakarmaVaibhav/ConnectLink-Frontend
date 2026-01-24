import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const toggleTheme = () => {
        // Simple toggle for the quick button, defaulting to light/dark.
        // The Navbar dropdown offers full selection.
        if (theme === "dark" || theme === "luxury" || theme === "black" || theme === "night") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    const isDark = ["dark", "luxury", "black", "night", "business"].includes(theme);

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost btn-sm transition-all duration-300 ease-in-out"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-blue-400" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    );
};

export default ThemeToggle;
