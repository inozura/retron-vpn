import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import chrome from '../../img/chrome.svg';
import firefox from '../../img/firefox.svg';

export default function Browsers() {
  return (
    <>
      <Divider textAlign="left" sx={{ mb: 2 }}>
        <Typography variant="caption" color="#828282">
          JailbreakVPN Browser Extension
        </Typography>
      </Divider>
      <Typography variant="caption">
        The JailbreakVPN Browser Extension lets you control you VPN connection
        directly from your browser. Learn more
      </Typography>
      <Box display="flex" mt={4}>
        <Box display="flex">
          <img alt="chrome" src={chrome} width="20%" />
          <Stack ml={2}>
            <Typography variant="caption">
              <strong>Google Chrome</strong>
            </Typography>
            <Button
              sx={{ mt: 1, typography: 'caption' }}
              size="small"
              variant="outlined"
            >
              Install in Chrome
            </Button>
          </Stack>
        </Box>
        <Box display="flex">
          <img alt="firefox" src={firefox} width="20%" />
          <Stack ml={2}>
            <Typography variant="caption">
              <strong>Mozilla Firefox</strong>
            </Typography>
            <Button
              sx={{ mt: 1, typography: 'caption' }}
              size="small"
              variant="outlined"
            >
              Get Firefox
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
