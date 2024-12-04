import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormGroup,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';

export default function General() {
  return (
    <>
      <Stack spacing={5}>
        <Box>
          <Divider textAlign="left">
            <Typography variant="caption" color="#828282">
              Startup
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Launch Retron VPN on OS startup
                </Typography>
              }
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Start Retron minimized
                </Typography>
              }
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Convert to the last used location when Retron VPN is
                  launched
                </Typography>
              }
            />
          </FormGroup>
        </Box>
        <Box>
          <Divider textAlign="left">
            <Typography variant="caption" color="#828282">
              Network Look
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Stop all internet traffic if the VPN disconnects unexpectedly
                </Typography>
              }
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Allow access to devices on the local network (such as printers
                  or file servers)
                </Typography>
              }
            />
          </FormGroup>
        </Box>
        <Box>
          <Divider textAlign="left">
            <Typography variant="caption" color="#828282">
              Split tunneling
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Manage connection on a per-app basis
                </Typography>
              }
            />
          </FormGroup>
          <Box ml={4}>
            <Typography
              variant="caption"
              color="#8F8F8F"
              component="div"
              mb={2}
            >
              Click Settings to choose which apps use Retron VPN when
              connected.
            </Typography>
            <Button variant="outlined" size="small">
              Settings
            </Button>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
