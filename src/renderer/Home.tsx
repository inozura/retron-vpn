import { Stack, Box, Button } from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CircleFlag } from 'react-circle-flags';
import RemainingMb from './components/RemainingMb';
import MenuTopBar from './components/MenuTopBar';
import { useAuth } from './contexts/AuthContext';
import before_connect from './img/before-connect.gif';
import premium_before_connect from './img/premium-before-connect.gif';

export default function Home({ selectedServer, connectedServer }) {
  const auth = useAuth();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleConnect = () => {
    fetch(`${process.env.API_BASE_URL}/remaining-mb`, {
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
          if (result.status === 200) {
            if (parseFloat(result.remainingMb) <= 0) {
              enqueueSnackbar('Please buy subscription.', { variant: 'warning' });
            } else {
              history.push('/connecting');
            }
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.error('Error:', error);
      })
  };

  return (
    <>
      <MenuTopBar connectedServer={connectedServer} />
      <RemainingMb />
      <Box
        component="img"
        alt="before-connect"
        src={auth.premium == false ? before_connect : premium_before_connect}
        width="100%"
      />
      <Stack spacing={2} mx={6}>
        <Button
          variant="outlined"
          size="large"
          sx={{ textTransform: 'none' }}
          disabled={selectedServer.id === undefined}
          onClick={handleConnect}
        >
          Connect
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={RouterLink}
          to="/servers"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            textTransform: 'none',
            color: 'black',
            borderColor: 'gray',
          }}
        >
          {selectedServer.icon === "" ? (
            <CircleFlag
              countryCode={selectedServer.country_code.toLowerCase()}
              height="16"
            />
          ) : (
            <img
              src={selectedServer.icon}
              width="8%"
            />
          )}
          {selectedServer.name ? (selectedServer.name.length > 20
            ? selectedServer.name.substring(0, 20 - 3) + '...'
              : selectedServer.name
           ) : 'Select Location'}
          <ArrowForwardIosIcon fontSize="small" sx={{ width: '6%' }} />
        </Button>
      </Stack>
    </>
  );
}
