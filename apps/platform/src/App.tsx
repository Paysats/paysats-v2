import { useState, useEffect } from 'react'
import './App.css'
import { ConfigProvider, theme } from 'antd'
import { PWAInstallPrompt } from '../../../packages/shared/src/components/PWAInstallPrompt';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  const [mounted, setMounted] = useState(false);

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
      <AppRoutes />
      <PWAInstallPrompt />
    </ConfigProvider>
  )
}

export default App

