import { Box, Container, Card, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { styled } from '@mui/material/styles';
import Logo from 'src/components/LogoSign';
import Hero from './Hero';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from '../dashboards/Crypto/PageHeader';

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);

function Overview() {
  return (
    <OverviewWrapper>
      <>
        <Helmet>
          <title>Overview</title>
        </Helmet>
        <PageTitleWrapper>
          <Typography variant="h3" component="h3" gutterBottom>
            Overview
          </Typography>
          <Typography variant="subtitle2">
            This contains the demo of the website
          </Typography>
        </PageTitleWrapper>
        <Container maxWidth="lg"></Container>
      </>
    </OverviewWrapper>
  );
}

export default Overview;
