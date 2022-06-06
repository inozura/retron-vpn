import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/material';
import protocol_vector from '../../img/protocol_vector.svg';

export default function RadioButtonsGroup() {
  return (
    <>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="protocol"
          defaultValue="automatic"
          name="radio-buttons-group"
        >
          <Stack spacing={1}>
            <Box>
              <FormControlLabel
                value="automatic"
                control={<Radio color="default" size="small" />}
                label={
                  <Typography variant="caption">
                    Automatic (recommended)
                  </Typography>
                }
              />
              <Typography variant="caption" component="div" ml={3.5}>
                Jailbreak VPN will automatically pick the protocol most
                appropriate for your network.
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                value="lightway"
                control={<Radio color="default" size="small" />}
                label={
                  <Typography variant="caption">
                    Lightway - UDP (preview)
                  </Typography>
                }
              />
              <Typography variant="caption" component="div" ml={3.5}>
                Jailbreak VPN’s next generation protocol optimized for speed,
                stability. Advanced options
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                value="openvpn_udp"
                control={<Radio color="default" size="small" />}
                label={<Typography variant="caption">OpenVPN - UDP</Typography>}
              />
              <Typography variant="caption" component="div" ml={3.5}>
                Best combination of speed and security, but may not work all
                networks.
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                value="openvpn_tcp"
                control={<Radio color="default" size="small" />}
                label={<Typography variant="caption">OpenVPN - TCP</Typography>}
              />
              <Typography variant="caption" component="div" ml={3.5}>
                Likely to function on all type of networks, but might be slower
                than OpenVPN - UDP
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                value="ike_v2"
                control={<Radio color="default" size="small" />}
                label={<Typography variant="caption">IKEv2</Typography>}
              />
              <Typography variant="caption" component="div" ml={3.5}>
                Fast, but may not work on all networks.
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                value="l2tp_ipsec"
                control={<Radio color="default" size="small" />}
                label={
                  <Typography variant="caption">
                    L2TP/IPsec (lower security)
                  </Typography>
                }
              />
            </Box>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Box display="flex" justifyContent="center" mt={4}>
        <img
          src={protocol_vector}
          alt="Our VPN servers run on RAM, not hard drives. Learn more"
          width="5%"
        />
        <Typography variant="caption" ml={1}>
          Our VPN servers run on RAM, not hard drives. Learn more
        </Typography>
      </Box>
    </>
  );
}
