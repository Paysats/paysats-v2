import { useState, useEffect } from 'react'
import './App.css'
import { ConfigProvider, theme, notification } from 'antd'
import { DashRoutes } from './routes/DashRoutes';
import { ThemeProvider } from '@shared/contexts/ThemeContext';

notification.config({
  maxCount: 2,
});

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('light');
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#33C279",
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <ThemeProvider>
        <DashRoutes />
      </ThemeProvider>
    </ConfigProvider>
  )
}

export default App
