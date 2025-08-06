import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Logout,
  DarkMode,
  LightMode,
  Dashboard,
  Login,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import techHubLight from '../assets/techhub-light.png';
import techHubDark from '../assets/techhub-dark.png';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src={darkMode ? techHubLight : techHubDark}
            alt='TechHub Logo'
            style={{
              height: '40px',
              marginRight: '12px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/products')}
          />
          <Typography variant='h6'>E-Commerce App</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color='inherit' onClick={toggleDarkMode}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          <Button color='inherit' component={Link} to='/products'>
            Products
          </Button>

          {user ? (
            <>
              {isAdmin() && (
                <>
                  <Button
                    color='inherit'
                    onClick={handleAdminMenuOpen}
                    startIcon={<Dashboard />}
                  >
                    Admin
                  </Button>
                  <Menu
                    anchorEl={adminMenuAnchor}
                    open={Boolean(adminMenuAnchor)}
                    onClose={handleAdminMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/products');
                        handleAdminMenuClose();
                      }}
                    >
                      Manage Products
                    </MenuItem>
                  </Menu>
                </>
              )}

              <Button color='inherit' onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color='inherit' component={Link} to='/login'>
                <Login sx={{ mr: 1 }} />
                Login
              </Button>
              <Button color='inherit' component={Link} to='/register'>
                <Person sx={{ mr: 1 }} />
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
