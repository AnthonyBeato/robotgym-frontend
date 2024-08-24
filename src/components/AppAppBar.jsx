import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ToggleColorMode from './ToggleColorMode';

import RobotGym from './RobotGymIcon';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"

import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../instance/axiosIntance';

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  const handleLogout = () => {
    const apiUrl = import.meta.env.VITE_HOST;

    axiosInstance.post(`${apiUrl}/logout`, { token })
        .then(() => {
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            handleCloseMenu();
            navigate("/users/login");
        })
        .catch((error) => {
            console.error("Error logging out: ", error);
            alert("Error al cerrar sesión");
        });
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  let username = '';
  if (token) {
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken); // Verifica qué campos están presentes
    username = decodedToken.username || ''; // Asegúrate de que el campo username exista
}


  return (
    <AppBar
      position="fixed"
      sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 2 }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'hsla(220, 60%, 99%, 0.6)',
            boxShadow:
              '0 1px 2px hsla(235, 0%, 0%, 0.05), 0 2px 12px hsla(235, 100%, 80%, 0.5)',
            ...theme.applyStyles('dark', {
              bgcolor: 'hsla(220, 0%, 0%, 0.7)',
              boxShadow:
                '0 1px 2px hsla(235, 0%, 0%, 0.5), 0 2px 12px hsla(235, 100%, 25%, 0.3)',
            }),
          })}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <RobotGym />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/"
              >
                Inicio
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/experiments"
              >
                Experimentos
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/documentation"
              >
                Documentación
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/contact"
              >
                Contacto
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/admin/users"
              >
                Usuarios
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/robots"
              >
                Robots
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            {token ? (
              <>
              <Button color="primary" variant="text" size="small" onClick={handleOpenMenu}>
                  {username} 
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleCloseMenu}>
                  <MenuItem onClick={handleLogout}>
                  Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="primary" variant="text" size="small"
                component={Link}
                  to="/users/login"
                >
                  Iniciar Sesión
                </Button>
                <Button color="primary" variant="contained" size="small"
                  component={Link}
                    to="/users/register"
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem component={Link} to="/" onClick={toggleDrawer(false)}>
                  Inicio
                </MenuItem>
                <MenuItem component={Link} to="/experiments" onClick={toggleDrawer(false)}>
                  Experimentos
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('highlights')}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('pricing')}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
