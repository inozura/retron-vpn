import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CircleFlag } from 'react-circle-flags';
import { Stack, Box, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSnackbar } from 'notistack';
import { useAuth } from './contexts/AuthContext';
import RemainingMb from './components/RemainingMb';
import MenuTopBar from './components/MenuTopBar';
import connected from './img/connected.gif';
import premium_connected from './img/premium-connected.gif';

export default function Connected({ selectedServer, connectedServer, platformId, protocolId }) {
  const history = useHistory();
  const auth = useAuth();
  const [isFailed, setIsFailed] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    window.open('https://jailbreakvpn.com/checkip.php');
  }, []);

  useEffect(() => {
    const disConnectCallback = (arg) => {
      if (arg === 'disconnected') {
        if (isFailed == false && location.pathname == '/connected') {
          history.push('/rating');
        }
      }
    };

    window.electron.ipcRenderer.on('vpnConnection', disConnectCallback);

    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        'vpnConnection',
        disConnectCallback
      );
    };
  }, []);

  useEffect(() => {
    const failedCallback = (arg) => {
      if (arg === 'failed') {
        setIsFailed(true);
        const reqBody = {
          server_id: selectedServer.id,
          platform_id: platformId,
          protocol_id: protocolId,
        };
        fetch(`${process.env.API_BASE_URL}/connection-failed`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        })
          .then((res) => {
            if (res.status === 401) {
              auth.setToken(null);
            }
            return res.json();
          })
          .then(
            (result) => {
              //
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              //
            }
          )
          .catch((error) => {
            //
          });
          enqueueSnackbar('Something went wrong.', { variant: 'error' });
          history.push('/home');
      }
    };

    window.electron.ipcRenderer.on('vpnConnection', failedCallback);

    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        'vpnConnection',
        failedCallback
      );
    };
  }, []);


  return (
    <>
      <MenuTopBar connectedServer={connectedServer} />
      <RemainingMb />
      <Box component="img" alt="connected" src={auth.premium == false ? connected : premium_connected} width="100%" />
      <Stack spacing={2} mx={6}>
        <Button
          variant="outlined"
          size="large"
          sx={{ textTransform: 'none' }}
          onClick={() => {
            window.electron.ipcRenderer.disconnectVpn();
          }}
        >
          Disconnect
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            textTransform: 'none',
            color: 'black',
            borderColor: 'gray',
          }}
          disabled
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
          {selectedServer.name.length > 20
            ? selectedServer.name.substring(0, 20 - 3) + '...'
            : selectedServer.name}
          <ArrowForwardIosIcon fontSize="small" sx={{ width: '6%' }} />
        </Button>
      </Stack>
    </>
  );
}
