import { useState, useEffect } from 'react'
import './App.css'
import { ConfigProvider, theme } from 'antd'
import { MarketingRoutes } from './routes/MarketingRoutes';

function App() {
  const [mounted, setMounted] = useState(false);

  // dark mode default
  useEffect(() => {
    // ensure light class is not present (dark is default)
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
      <MarketingRoutes />
    </ConfigProvider>
  )
}

export default App

