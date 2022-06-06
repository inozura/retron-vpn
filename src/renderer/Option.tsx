/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import WindowIcon from '@mui/icons-material/Window';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ImportExportIcon from '@mui/icons-material/ImportExport';
// import ShortcutIcon from '@mui/icons-material/Shortcut';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Button, Container, Typography } from '@mui/material';
import LogoTopBar from './components/LogoTopBar';
import General from './components/options/General';
import Account from './components/options/Account';
import Protocol from './components/options/Protocol';
// import Shortcuts from './components/options/Shortcuts';
import Browsers from './components/options/Browsers';
import Advance from './components/options/Advance';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          <Box
            sx={{
              display: 'flex',
              '& > :not(style)': {
                m: 1,
                width: '100%',
              },
            }}
          >
            <Paper elevation={3}>
              <Container>
                <Box my={2} sx={{ minHeight: '65vh' }}>
                  <form>{children}</form>
                </Box>
              </Container>
            </Paper>
          </Box>
        </>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <LogoTopBar title="Options" bgcolor="#FFFFFF" />
      <Box
        bgcolor="#EFEFEF"
        sx={{
          minHeight: '100vh',
          position: 'absolute',
          zIndex: 0,
        }}
      >
        <Box maxWidth="100vw" mt={5}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="option tabs"
            variant="scrollable"
            textColor="inherit"
          >
            <Tab
              icon={<WindowIcon fontSize="small" />}
              label={<Typography variant="body2">General</Typography>}
              {...a11yProps(0)}
            />
            <Tab
              icon={<PersonOutlineIcon fontSize="small" />}
              label={<Typography variant="body2">Account</Typography>}
              {...a11yProps(1)}
            />
            <Tab
              icon={<ImportExportIcon fontSize="small" />}
              label={<Typography variant="body2">Protocol</Typography>}
              {...a11yProps(2)}
            />
            {/* <Tab
              icon={<ShortcutIcon fontSize="small" />}
              label={<Typography variant="body2">Shortcuts</Typography>}
              {...a11yProps(3)}
            /> */}
            <Tab
              icon={<ExploreOutlinedIcon fontSize="small" />}
              label={<Typography variant="body2">Browsers</Typography>}
              {...a11yProps(3)}
            />
            <Tab
              icon={<SettingsOutlinedIcon fontSize="small" />}
              label={<Typography variant="body2">Advance</Typography>}
              {...a11yProps(4)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <General />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Account />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Protocol />
        </TabPanel>
        {/* <TabPanel value={value} index={3}>
          <Shortcuts />
        </TabPanel> */}
        <TabPanel value={value} index={3}>
          <Browsers />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Advance />
        </TabPanel>
        <Box display="flex" justifyContent="flex-end" mr={1} py={1}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>
            OK
          </Button>
          <Button variant="outlined" size="small">
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
