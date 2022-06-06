import { useState, useEffect, useRef } from 'react';
import { Typography, Box, Link } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth } from '../contexts/AuthContext';

export default function RemainingMb() {
  const auth = useAuth();
  let [allocatedMb, setAllocatedMb] = useState(0);
  let [usedMb, setUsedMb] = useState(0);
  let [progress, setProgress] = useState(0);
  const componentMounted = useRef(true);

  useEffect(() => {
    fetch(`${process.env.API_BASE_URL}/remaining-mb`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401) {
          auth.setToken(null);
        }
        return res.json();
      })
      .then(
        (result) => {
          if (result.status === 200 && componentMounted.current) {
            allocatedMb = Math.round(parseFloat(result.allocatedMb));
            usedMb = Math.round(
              Math.round(parseFloat(result.allocatedMb)) -
                Math.round(parseFloat(result.remainingMb))
            );
            progress = Math.round(Math.min((usedMb / allocatedMb) * 100, 100));
            setAllocatedMb(allocatedMb);
            setUsedMb(usedMb);
            setProgress(progress);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    const updateUsage = (mb) => {
      setTimeout(() => {
        fetch(`${process.env.API_BASE_URL}/update-mb`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mb }),
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
                if (parseFloat(result.remainingMb) <= 0) {
                  window.electron.ipcRenderer.disconnectVpn();
                }
              }
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error);
            }
          )
          .catch((error) => {
            console.error('Error:', error);
          });
      }, 5000);
    };

    window.electron.ipcRenderer.on('vpnUsage', updateUsage);

    return () => {
      componentMounted.current = false;
      window.electron.ipcRenderer.removeAllListeners('vpnUsage');
    };
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#EFEFEF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={30}
          sx={{ m: 0.5 }}
        />
        <Typography component="div" variant="caption" color="text.secondary">
          <strong>
            {usedMb}/{allocatedMb} MB
          </strong>{' '}
          of free data used
        </Typography>
      </Box>
      <Link
        href="https://www.jailbreakvpn.com/pricing"
        target="_blank"
        rel="noopener"
        underline="none"
        variant="caption"
        sx={{ color: 'primary.main', display: 'flex', ml: 0.5 }}
      >
        Go unlimited
        <ArrowForwardIosIcon fontSize="small" sx={{ width: '8%' }} />
      </Link>
    </Box>
  );
}
