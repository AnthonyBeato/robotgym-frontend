import * as React from 'react';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import getLPTheme from './theme/getLPTheme';
import { Outlet } from "react-router-dom";

function App() {
  const [mode, setMode] = React.useState(localStorage.getItem('themeMode') || 'light');
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); 
  };

  return (
    <>
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Box>
          <Outlet />
        </Box>
      </ThemeProvider>
    </>
  )
}

export default App
