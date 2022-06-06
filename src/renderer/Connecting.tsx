import { useEffect, useState, useRef } from 'react';
import { Stack, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { CircleFlag } from 'react-circle-flags';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth } from './contexts/AuthContext';
import RemainingMb from './components/RemainingMb';
import MenuTopBar from './components/MenuTopBar';
import connecting from './img/connecting.gif';
import premium_connecting from './img/premium-connecting.gif';

export default function Connecting({
  selectedServer,
  connectedServer,
  platformId,
  protocolId,
  setConnectedServer,
  setPlatformId,
  setProtocolId,
}) {
  const history = useHistory();
  const auth = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const protocol = 'OVT';
  const [isFailed, setIsFailed] = useState(false);
  const componentMounted = useRef(true);

  const connectVpn = () => {
    if (selectedServer.id) {
      fetch(
        `${process.env.API_BASE_URL}/server-detail/${selectedServer.id}/${process.env.PLATFORM}/${protocol}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => {
          if (res.status === 401) {
            auth.setToken(null);
          }
          return res.json();
        })
        .then(
          (result) => {
            if (result.status === 200 && componentMounted.current) {
              setPlatformId(result.serverDetail.platform_id);
              setProtocolId(result.serverDetail.protocol_id);
              return window.electron.ipcRenderer.connectVpn(
                result.serverDetail
              );
            }
            return console.log(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            enqueueSnackbar('Something went wrong.', { variant: 'error' });
            history.push('/home');
          }
        )
        .catch((error) => {
          enqueueSnackbar('Something went wrong.', { variant: 'error' });
          history.push('/home');
        });
    }
  };

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

  useEffect(() => {
    connectVpn();

    const connectedCallback = (arg) => {
      if (arg === 'connected') {
        if (isFailed == false) {
          setConnectedServer(selectedServer);
          history.push('/connected');
        }
      }
    };
    window.electron.ipcRenderer.on('vpnConnection', connectedCallback);

    return () => {
      componentMounted.current = false;
      window.electron.ipcRenderer.removeAllListeners(
        'vpnConnection',
        connectedCallback
      );
    };
  }, []);

  return (
    <>
      <MenuTopBar connectedServer={connectedServer} />
      <RemainingMb />
      <Box component="img" alt="connecting" src={auth.premium == false ? connecting : premium_connecting} width="100%" />
      <Stack spacing={2} mx={6}>
        <Button variant="outlined" size="large" sx={{ textTransform: 'none' }}>
          Connecting
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
