import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
  Select,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';

export default function Advance() {
  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Divider textAlign="left" sx={{ mb: 1 }}>
            <Typography variant="caption" color="#828282">
              Startup
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Share crash reports, speed tests, usability diagnostics and
                  whether VPN connection attempts succeed. These reports never
                  contain personally identifiable information.
                </Typography>
              }
            />
          </FormGroup>
        </Box>
        <Box>
          <Divider textAlign="left" sx={{ mb: 1 }}>
            <Typography variant="caption" color="#828282">
              IPv6 leak protection
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Prevent IPv6 address detection while connected.
                </Typography>
              }
            />
            <Typography
              variant="caption"
              component="div"
              ml={4}
              color="#8F8F8F"
            >
              Only disable if you need IPv6 connectivity.
            </Typography>
          </FormGroup>
        </Box>
        <Box>
          <Divider textAlign="left" sx={{ mb: 1 }}>
            <Typography variant="caption" color="#828282">
              DNS
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Only use RetronVPN DNS servers while connected.
                </Typography>
              }
            />
          </FormGroup>
        </Box>
        <Box>
          <Divider textAlign="left" sx={{ mb: 1 }}>
            <Typography variant="caption" color="#828282">
              Network setting
            </Typography>
          </Divider>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="caption">
                  Optimizing OS networking to maximize VPN speed.
                </Typography>
              }
            />
            <Typography
              variant="caption"
              component="div"
              ml={4}
              color="#8F8F8F"
            >
              Only disable if your internet is slower than usual. Learn more
            </Typography>
          </FormGroup>
        </Box>
        <Box>
          <Typography
            variant="caption"
            component="div"
            color="#8F8F8F"
            gutterBottom
          >
            Language
          </Typography>
          <select name="lang">
            <option value="en">English</option>
          </select>
        </Box>
      </Stack>
    </>
  );
}
