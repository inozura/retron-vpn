import { Box, Button, Stack, Typography } from '@mui/material';

export default function Account() {
  return (
    <>
      <Stack spacing={5}>
        <Box>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography
                variant="caption"
                component="div"
                color="#828282"
                mb={1}
              >
                Account status
              </Typography>
              <Typography variant="caption" component="div">
                Inactive
              </Typography>
            </Box>
            <Box mr={15}>
              <Typography
                variant="caption"
                component="div"
                color="#828282"
                mb={1}
              >
                Expires
              </Typography>
              <Typography variant="caption" component="div">
                N/A
              </Typography>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mr={20} mt={2}>
            <Button variant="outlined" size="small">
              Manage Account
            </Button>
            <Button variant="outlined" size="small">
              Sign In
            </Button>
          </Box>
        </Box>
        <Box>
          <Typography variant="caption" component="div" color="#828282" mb={1}>
            Refer friends
          </Typography>
          <Typography variant="caption" component="div" mb={2}>
            Share Retron VPN and get free service!
            <br />
            For every friend who signs up we’ll give you both 30 days free.
          </Typography>
          <Button variant="outlined" size="small">
            Refer Friends
          </Button>
        </Box>
      </Stack>
    </>
  );
}
