import { useState, useEffect } from 'react'
import './App.css'
import { ConfigProvider, theme } from 'antd'
import { Route, Routes } from 'react-router-dom'


function App() {
  const [mounted, setMounted] = useState(false);

  // Dark mode is default
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
        <Routes>
          <Route path="/" element={<div />} /> 
        </Routes>
      </ConfigProvider>
  )
}

export default App
