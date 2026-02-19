import { createContext, use, useState, type FC } from "react"


interface ThemeContextType {
    theme: "light" | "dark";
    isDark: boolean;
    toggleTheme: () => void;
}



export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = use(ThemeContext)

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return context
};


export const ThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {


    const [theme, setTheme] = useState<"light" | "dark">("dark");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const isDark = theme === "dark";

    const value = {
        theme,
        isDark,
        toggleTheme,
    }

    return <ThemeContext.Provider
        value={value}
    >
        {children}
    </ThemeContext.Provider>
}