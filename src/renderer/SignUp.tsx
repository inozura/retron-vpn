import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import LogoTopBar from './components/LogoTopBar';
import { useAuth } from './contexts/AuthContext';

export default function SignUp() {
  const history = useHistory();
  const auth = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const defaultValues = {
    email: '',
    password: '',
    password_confirmation: '',
    brand_key: process.env.BRAND_KEY,
  };

  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${process.env.API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // eslint-disable-next-line promise/always-return
          if (result.token) {
            auth.setToken(() => {
              return result.token;
            });
            enqueueSnackbar('Successfully registered.', { variant: 'success' });
            history.push('/home');
          } else if (result.status === 400) {
            enqueueSnackbar(Object.values(result.errors)[0], {
              variant: 'warning',
            });
          } else {
            enqueueSnackbar('Something went wrong.', { variant: 'error' });
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
    <>
      <LogoTopBar title="Jailbreak VPN" bgcolor="#D4EDF6" />
      <Container
        sx={{
          minHeight: '100vh',
          position: 'absolute',
          zIndex: 0,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            mt={6}
            mx={2}
          >
            <Typography variant="h4" component="div" mt={2} gutterBottom>
              Sign Up
            </Typography>
            <OutlinedInput
              id="email"
              name="email"
              type="email"
              color="primary"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ borderRadius: 28 }}
            />
            <OutlinedInput
              id="password"
              name="password"
              type="password"
              color="primary"
              placeholder="Enter password"
              value={formValues.password}
              onChange={handleInputChange}
              fullWidth
              sx={{ borderRadius: 28 }}
            />
            <OutlinedInput
              id="password-confirmation"
              name="password_confirmation"
              type="password"
              color="primary"
              placeholder="Confirm password"
              value={formValues.password_confirmation}
              onChange={handleInputChange}
              fullWidth
              sx={{ borderRadius: 28 }}
            />
          </Stack>
          <Stack
            spacing={6}
            alignItems="center"
            justifyContent="center"
            mx={5}
            my={2}
          >
            <Button
              sx={{
                borderRadius: 28,
                bgcolor: '#133379',
                textTransform: 'none',
              }}
              variant="contained"
              type="submit"
              size="large"
              fullWidth
            >
              Sign Up
            </Button>
            <Stack alignItems="center" spacing={1}>
              <Link
                href="https://community.jailbreakvpn.com/"
                target="_blank"
                rel="noopener"
                underline="none"
                color="text.primary"
                sx={{ typography: 'caption' }}
              >
                Need Help?
              </Link>
              <Typography variant="caption">
                Already have an account?{' '}
                <Link component={RouterLink} underline="none" to="/sign-in">
                  Sign In
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  );
}
