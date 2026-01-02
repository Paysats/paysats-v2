import { useState, useEffect } from 'react'
import './App.css'
import { ConfigProvider, theme } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/ThemeContext';
import { Homepage } from './pages/landing/home';
import { isAppSubdomain } from './utils/isAppSubdomain';
import NotFound from './pages/NotFound';
import { AppRoutes } from './routes/AppRoutes';
import { MarketingRoutes } from './routes/MarketingRoutes';
function App() {
  const [mounted, setMounted] = useState(false);

  const isApp = isAppSubdomain();

  // Dark mode is default, can be toggled later with a theme context
  useEffect(() => {
    // Ensure light class is not present (dark is default)
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#33C279",
          // colorPrimaryText: "#1a1a1a",
          // colorTextLightSolid: "#1a1a1a", // controls text color for primary buttons
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
        {
          isApp ? (
            <AppRoutes />
          ) : (
            <MarketingRoutes />
          )
        }
    </ConfigProvider>
  )
}

export default App
