import { useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Card,
  Container,
  Link,
  Rating as MuiRating,
  Stack,
  Typography,
} from '@mui/material';
import MenuTopBar from './components/MenuTopBar';
import RemainingMb from './components/RemainingMb';
import { useAuth } from './contexts/AuthContext';

export default function Rating({
  selectedServer,
  connectedServer,
  setConnectedServer,
  platformId,
  protocolId,
}) {
  const history = useHistory();
  const auth = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    setConnectedServer({});
  }, []);

  const handleRatingChange = (event, newValue) => {
    const reqBody = {
      server_id: selectedServer.id,
      rating: newValue,
      platform_id: platformId,
      protocol_id: protocolId,
      brand_key: process.env.BRAND_KEY,
    };

    fetch(`${process.env.API_BASE_URL}/user-rating`, {
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
          // eslint-disable-next-line promise/always-return
          if (result.status === 200) {
            enqueueSnackbar('Thanks for your feedback!', {
              variant: 'success',
            });
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
      })
      .finally(() => {
        setTimeout(() => {
          history.push('/home');
        }, 2000);
      });
  };

  return (
    <>
      <MenuTopBar connectedServer={connectedServer} />
      <RemainingMb />
      <Container maxWidth="sm">
        <Stack spacing={2} alignItems="center">
          <Card sx={{ mt: '30%', px: 4 }} raised>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              my={5}
            >
              <Typography variant="body1" fontWeight="bold">
                How was the connection?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tap to rate
              </Typography>
              <form>
                <MuiRating
                  name="rating"
                  onChange={handleRatingChange}
                  size="large"
                />
              </form>
            </Stack>
          </Card>
          <Link
            to="/home"
            underline="always"
            component={RouterLink}
            color="text.primary"
          >
            Skip
          </Link>
        </Stack>
      </Container>
    </>
  );
}
