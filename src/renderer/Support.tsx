import Typography from '@mui/material/Typography';
import { Link, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BackTopBar from './components/BackTopBar';
import logo from './img/logo96.png';

export default function Support() {
  return (
    <>
      <BackTopBar title="Help & Support" />
      <Stack spacing={2} alignItems="center" mt={5}>
        <img alt="logo" src={logo} width="25%" />
        <Typography variant="body1" fontWeight="500">
          Jailbreak VPN Technologies Inc.
        </Typography>
      </Stack>
      <hr />
      <Stack spacing={2} mx={4} mt={4}>
        <Link
          href="https://community.jailbreakvpn.com"
          target="_blank"
          rel="noopener"
          variant="body1"
          fontWeight="500"
          underline="none"
          color="inherit"
          display="flex"
          justifyContent="space-between"
        >
          Troubleshoot
          <ArrowForwardIosIcon fontSize="small" sx={{ width: '5%' }} />
        </Link>
        <Link
          href="https://community.jailbreakvpn.com"
          target="_blank"
          rel="noopener"
          variant="body1"
          fontWeight="500"
          underline="none"
          color="inherit"
          display="flex"
          justifyContent="space-between"
        >
          Report Bug
          <ArrowForwardIosIcon fontSize="small" sx={{ width: '5%' }} />
        </Link>
      </Stack>
    </>
  );
}
