import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  userRole?: string | null
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  userRole = null,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (userRole === 'store_admin') {
      return stored || defaultTheme;
    } else {
      // Only allow dark/light for non-store_admin
      if (stored === 'dark' || stored === 'light') return stored;
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    if (userRole === 'store_admin') {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"
        root.classList.add(systemTheme)
        return
      }
      root.classList.add(theme)
    } else {
      // Only allow dark/light for non-store_admin
      root.classList.add(theme === 'dark' ? 'dark' : 'light');
    }
  }, [theme, userRole])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (userRole === 'store_admin') {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      } else {
        // Only allow dark/light for non-store_admin
        if (newTheme === 'dark' || newTheme === 'light') {
          localStorage.setItem(storageKey, newTheme)
          setTheme(newTheme)
        }
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
    
  return context
}

export default ThemeProvider;
