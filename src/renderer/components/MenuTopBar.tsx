import * as React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useSnackbar } from 'notistack';
import WindowAction from './WindowAction';
import { useAuth } from '../contexts/AuthContext';

export default function MenuTopBar({ connectedServer }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const auth = useAuth();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    fetch(`${process.env.API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401) {
          auth.setToken(null);
        }
        return res.json();
      })
      .then(
        (result) => {
          // eslint-disable-next-line promise/always-return
          if (result.status === 200) {
            auth.setToken(null);
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('token');
            history.push('/sign-in');
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          enqueueSnackbar('Something went wrong.', { variant: 'error' });
        }
      )
      .catch((error) => {
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className="titlebar"
    >
      <IconButton
        size="medium"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <MenuItem
          onClick={() => {
            window.electron.ipcRenderer.showOption();
          }}
        >
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Option</ListItemText>
        </MenuItem> */}
        {connectedServer.id === undefined && auth.token !== null ? (
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <AccountCircleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        ) : (
          ''
        )}
        <MenuItem component={RouterLink} to="/support">
          <ListItemIcon>
            <HelpOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help & Support</ListItemText>
        </MenuItem>
        <MenuItem component={RouterLink} to="/about">
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>About Us</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => window.electron.ipcRenderer.closeWindow()}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Quit</ListItemText>
        </MenuItem>
      </Menu>
      <Typography variant="subtitle2">Jailbreak VPN</Typography>
      <Box display="flex">
        <WindowAction />
      </Box>
    </Box>
  );
}
