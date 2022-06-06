import { useHistory } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WindowAction from './WindowAction';

// eslint-disable-next-line react/prop-types
export default function BackTopBar({ title }) {
  const history = useHistory();

  return (
    <Box display="flex" justifyContent="space-between" className="titlebar">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          ml: 0.5,
        }}
      >
        <IconButton size="medium" onClick={history.goBack}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="body1" color="text.secondary" ml={1}>
          {title}
        </Typography>
      </Box>
      <Box display="flex">
        <WindowAction />
      </Box>
    </Box>
  );
}
