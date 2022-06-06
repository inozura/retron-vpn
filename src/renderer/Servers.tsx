import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import SimpleBar from 'simplebar-react';
import { Box, Stack, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DoneIcon from '@mui/icons-material/Done';
import { CircleFlag } from 'react-circle-flags';
import BackTopBar from './components/BackTopBar';
import { useAuth } from './contexts/AuthContext';

export default function Servers({ selectedServer, setSelectedServer }) {
  const auth = useAuth();
  const history = useHistory();
  const [servers, setServers] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const protocol = 'OVT';

  useEffect(() => {
    fetch(
      `${process.env.API_BASE_URL}/servers/${process.env.PLATFORM}/${protocol}`,
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
          if (result.status === 200) {
            return setServers(result.servers);
          }
          return console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          history.push('/home');
          enqueueSnackbar('Something went wrong.', { variant: 'error' });
        }
      )
      .catch((error) => {
        history.push('/home');
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      });
  }, []);

  const serverItems = servers.map((server) => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      key={server.id}
      onClick={() => {
        setSelectedServer(server);
        setTimeout(() => {
          history.push('/home');
        }, 1000);
      }}
    >
      <Box display="inline-flex" alignItems="center">
        {server.icon === "" ? (
          <CircleFlag
            countryCode={server.country_code.toLowerCase()}
            height="35"
          />
        ) : (
          <img alt={server.name} src={server.icon} width="16%" />
        )}
        <Typography variant="body2" ml={2}>
          {server.name}
        </Typography>
      </Box>
      {server.id === selectedServer.id ? (
        <DoneIcon fontSize="small" />
      ) : (
        <ArrowForwardIosIcon fontSize="small" sx={{ width: '5%' }} />
      )}
    </Box>
  ));

  return (
    <>
      <BackTopBar title="Virtual Locations" />
      <SimpleBar style={{ maxHeight: 500 }}>
        <Stack spacing={3} mx={2} my={2} className="servers">
          {serverItems}
        </Stack>
      </SimpleBar>
    </>
  );
}
