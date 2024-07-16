import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

interface HeaderProps {
  title: string;
  subtitle: string;
  butnName?: string;
  butnFnt?: () => void;
}
function PageHeader({
  title,
  subtitle,
  butnName = 'default',
  butnFnt
}: HeaderProps) {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle2">{subtitle}</Typography>
      </Grid>
      <Grid item>
        {butnName != 'default' && (
          <Button
            onClick={butnFnt}
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {butnName}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
