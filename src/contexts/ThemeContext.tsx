import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// 主题本地存储键名
const THEME_STORAGE_KEY = "love-share-theme";

// 创建上下文，用于在组件树中共享主题状态
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: ReturnType<typeof createTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 自定义 Hook，方便子组件使用上下文
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// 创建主题配置
const createThemeConfig = (isDarkMode: boolean) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      ...(isDarkMode
        ? {
            // 深色模式 - 更柔和的深色主题
            background: {
              default: "#1e1e1e",
              paper: "#252525",
            },
            text: {
              primary: "rgba(255, 255, 255, 0.9)",
              secondary: "rgba(255, 255, 255, 0.7)",
            },
          }
        : {
            // 浅色模式 - 更柔和的浅色主题
            background: {
              default: "#f8f9fa",
              paper: "#ffffff",
            },
            text: {
              primary: "rgba(0, 0, 0, 0.87)",
              secondary: "rgba(0, 0, 0, 0.6)",
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      "none",
      "0px 1px 2px rgba(0, 0, 0, 0.05)",
      "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
      "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
      "0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)",
      "0px 15px 25px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.05)",
      "0px 20px 30px rgba(0, 0, 0, 0.15), 0px 8px 12px rgba(0, 0, 0, 0.05)",
      "0px 25px 40px rgba(0, 0, 0, 0.15), 0px 10px 15px rgba(0, 0, 0, 0.05)",
      "0px 30px 50px rgba(0, 0, 0, 0.2), 0px 15px 20px rgba(0, 0, 0, 0.05)",
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      // 扩展阴影数组，添加更多阴影样式，直到索引24，以匹配MUI默认主题
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      "0px 35px 60px rgba(0, 0, 0, 0.25), 0px 20px 25px rgba(0, 0, 0, 0.05)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)", // 索引16
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
      "0px 40px 70px rgba(0, 0, 0, 0.3), 0px 25px 30px rgba(0, 0, 0, 0.06)",
    ],
  });
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 初始化主题：优先从localStorage获取，其次从环境变量获取，最后默认为dark
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      // 1. 从localStorage读取主题偏好
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        return savedTheme === "dark";
      }
      // 2. 从环境变量读取默认主题
      const defaultTheme = import.meta.env.VITE_DEFAULT_THEME || "dark";
      return defaultTheme === "dark";
    } catch (error) {
      console.error("Failed to initialize theme:", error);
      return true; // 默认使用深色模式
    }
  });

  // 设置主题过渡持续时间CSS变量
  useEffect(() => {
    // 从环境变量获取主题过渡持续时间，默认0.3秒
    const transitionDuration =
      import.meta.env.VITE_THEME_TRANSITION_DURATION || "0.3";
    // 设置CSS变量，单位为秒
    document.documentElement.style.setProperty(
      "--theme-transition-duration",
      `${transitionDuration}s`
    );
  }, []);

  // 持久化主题到localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
    } catch (error) {
      console.error("Failed to persist theme:", error);
    }
  }, [isDarkMode]);

  // 切换暗黑模式
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // 使用useMemo优化主题创建，只有当isDarkMode变化时才重新创建主题
  const theme = useMemo(() => {
    return createThemeConfig(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
