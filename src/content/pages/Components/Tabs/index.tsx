import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider
} from '@mui/material';
import { useState, SyntheticEvent, lazy } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Footer from 'src/components/Footer';
import { Loader } from 'src/router';
import { Margin } from '@mui/icons-material';

// src/pages/Messaging/Whatsapp/index.tsx

const Whatsapp = Loader(
  lazy(() => import('src/pages/Messaging/Whatsapp/index'))
);

const ComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon/index'))
)

const Instagram = Loader(
  lazy(() => import('src/pages/Messaging/Instagram/Insta'))
)

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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
        <Box sx={{ pb: 3, pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function TabsDemo() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            {/* <Card> */}
            {/* <CardHeader title={value} />
              <Divider /> */}
            {/* <CardContent> */}
            <Box>
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Whatsapp"
                  {...a11yProps(0)}
                />
                <Tab label="Instagram" {...a11yProps(1)} />
                <Tab label="Meta" {...a11yProps(2)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Whatsapp />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Instagram />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <ComingSoon />
              </TabPanel>
            </Box>
            {/* </CardContent> */}
            {/* </Card> */}
          </Grid>
        </Grid>
      </Grid >
      {/* <Footer /> */}
    </>
  );
}

export default TabsDemo;
