import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import WindowAction from './WindowAction';
import logo from '../img/logo15x25.png';

// eslint-disable-next-line react/prop-types
export default function LogoTopBar({ bgcolor, title }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      bgcolor={bgcolor}
      sx={{ zIndex: 100, position: 'absolute', width: '100%' }}
      className="titlebar"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          ml: 2,
        }}
      >
        <img alt="logo" src={logo} />
        <Typography variant="subtitle2" ml={1} color="text.primary">
          {title}
        </Typography>
      </Box>
      <Box display="flex">
        <WindowAction />
      </Box>
    </Box>
  );
}
