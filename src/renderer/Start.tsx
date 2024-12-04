import { useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Container, Link } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import LogoTopBar from './components/LogoTopBar';
import alura from './img/alura.png';

export default function Start() {
  const history = useHistory();
  const auth = useAuth();

  useEffect(() => {
    if (auth.token) {
      history.push('/home');
    } else {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      if (rememberMe) {
        const token = localStorage.getItem('token');
        auth.setToken(token);
        history.push('/home');
      } else {
        history.push('/');
      }
    }
  }, []);

  const aluraStyle = { maxWidth: '90vw', maxHeight: '45vh' };

  return (
    <>
      <LogoTopBar title="Retron VPN" bgcolor="#FFFFFF" />
      <Container
        sx={{
          bgcolor: '#D4EDF6',
          minHeight: '100vh',
          position: 'absolute',
          zIndex: 0,
        }}
      >
        <Container>
          <Stack spacing={2} alignItems="center" mt={7}>
            <Typography variant="h6" color="#000000">
              Safely connect to public Wi-Fi in hotels, cafes and airports
            </Typography>
            <img alt="alura-in-the-park" src={alura} style={aluraStyle} />
            <Button
              variant="contained"
              sx={{
                borderRadius: 28,
                bgcolor: '#133379',
                textTransform: 'none',
              }}
              size="medium"
              component={RouterLink}
              to="/sign-in"
              fullWidth
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: 28, textTransform: 'none' }}
              size="medium"
            >
              <Link
                href="#" // subcription url
                target="_blank"
                rel="noopener"
                underline="none"
              >
                Buy a Subscription
              </Link>
            </Button>
          </Stack>
        </Container>
      </Container>
    </>
  );
}
