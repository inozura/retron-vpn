import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import LogoTopBar from './components/LogoTopBar';
import { useAuth } from './contexts/AuthContext';

export default function SignIn() {
  const history = useHistory();
  const auth = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const defaultValues = {
    email: '',
    password: '',
    rememberMe: true,
    brand_key: process.env.BRAND_KEY,
  };

  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { rememberMe, ...reqBody } = formValues;

    fetch(`${process.env.API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // eslint-disable-next-line promise/always-return
          if (result.user.premiumUser) {
            auth.setPremium(result.user.premiumUser);
          }
          if (result.token) {
            auth.setToken(() => {
              if (formValues.rememberMe === true) {
                localStorage.setItem('rememberMe', rememberMe.toString());
                localStorage.setItem('token', rememberMe ? result.token : '');
              }
              return result.token;
            });
            history.push('/home');
          } else if (result.status === 400) {
            enqueueSnackbar(Object.values(result.errors)[0], {
              variant: 'warning',
            });
          } else if (result.status === 401) {
            enqueueSnackbar('Wrong Credentials.', { variant: 'warning' });
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
  }

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
              Sign In
            </Typography>
            <OutlinedInput
              id="email"
              name="email"
              type="email"
              color="primary"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleInputChange}
              sx={{ borderRadius: 28 }}
              fullWidth
            />
            <OutlinedInput
              id="password"
              name="password"
              type="password"
              color="primary"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleInputChange}
              fullWidth
              sx={{ borderRadius: 28 }}
            />
          </Stack>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ ml: 4 }}
                  onChange={handleInputChange}
                  name="rememberMe"
                  checked={formValues.rememberMe}
                />
              }
              label={<Typography variant="caption">Remember me</Typography>}
            />
          </FormGroup>
          <Stack spacing={8} mx={5} alignItems="center" justifyContent="center">
            <Stack spacing={1} display="contents">
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
                Sign In
              </Button>
              <Link
                href="https://jailbreakvpn.com/forget_password"
                target="_blank"
                rel="noopener"
                underline="always"
                color="text.primary"
                sx={{ typography: 'caption' }}
              >
                Forget Password
              </Link>
            </Stack>
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
                New to Jailbreak VPN?{' '}
                <Link component={RouterLink} underline="none" to="/sign-up">
                  Sign Up
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  );
}
