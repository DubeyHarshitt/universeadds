import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import React, { lazy, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import SelectPlatform from './SelectPlatform';
import TabsDemo from 'src/content/pages/Components/Tabs';
import axios from 'axios';
import Status404 from 'src/content/pages/Status/Status404';
import { Loader } from 'src/router';
import SuspenseLoader from 'src/components/SuspenseLoader';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router';

function index() {
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [openSenderModal, setOpenSenderModal] = useState<boolean>(false);

  const WhatsappMain = Loader(
    lazy(() => import('src/pages/Messaging/Whatsapp/index'))
  );

  const TabsPanel = Loader(
    lazy(() => import('src/content/pages/Components/Tabs/index'))
  );

  const NewSender = Loader(
    lazy(() => import('src/pages/Messaging/Whatsapp/newSender'))
  );

  const handleNewSenderBtn = () => {
    navigate('/dashboards/messaging/new-sender');
    setOpenSenderModal(!openSenderModal);
  };
  return (
    <>
      {/* {loading && <SuspenseLoader />} */}
      {!loading ? (
        <>
          <Helmet>
            <title>Messaging</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              title={'Messaging'}
              subtitle={'Messages'}
              butnName={'New Sender'}
              butnFnt={handleNewSenderBtn}
            />
          </PageTitleWrapper>
          <Grid
            maxWidth="xl"
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* <SelectPlatform /> */}
            {/* {openSenderModal && <NewSender />} */}
            {/* <WhatsappMain /> */}
            <Grid style={{ padding: '20px', backgroundColor: 'white' }}>
              <TabsPanel />
            </Grid>
          </Grid>
        </>
      ) : (
        <>{<SuspenseLoader />}</>
      )}
    </>
  );

  // return(
  // <Paper elevation={3} style={{ padding: '20px', margin: '20px', }}>
  //   <TabsPanel />
  // </Paper>
  // )
}

export default index;
