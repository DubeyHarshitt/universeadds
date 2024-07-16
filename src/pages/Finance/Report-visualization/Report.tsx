import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Grid, TextField
} from '@mui/material';
import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { axisClasses } from '@mui/x-charts';

const employees = [
  { month: 'January', profit: 11800, loss: 5400 },
  { month: 'February', profit: 12700, loss: 5000 },
  { month: 'March', profit: 10750, loss: 4500 },
  { month: 'April', profit: 13600, loss: 6500 },
  { month: 'May', profit: 10550, loss: 7000 },
  { month: 'June', profit: 10650, loss: 7500 },
  { month: 'July', profit: 10800, loss: 8500 },
  { month: 'August', profit: 15700, loss: 8000 },
  { month: 'September', profit: 10600, loss: 6500 },
  { month: 'October', profit: 10750, loss: 7500 },
  { month: 'November', profit: 13850, loss: 17000 },
  { month: 'December', profit: 10950, loss: 16000 }
];

const widthMaps = {
  xs: '100%', sm: '75%', md: '50%', lg: '25%'
};
const widthMaps2 = {
  xs: '100%', sm: '150%', md: '100%', lg: '50%'
};
const widthMaps3 = {
  xs: '50%', sm: '37.5%', md: '25.5%', lg: '12.5%'
};

const chartSetting = {
  yAxis: [{ /* Custom y-axis settings */ }],
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)'
    }
  }
};
const valueFormatter = (value: number | null) => `${value} ₹`;

const Report = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Monthly Report', 20, 10);
    autoTable(doc, {
      head: [['Month', 'Profit', 'Loss']],
      body: employees.map(row => [row.month, row.profit, row.loss]),
      startY: 20
    });

    // Generate Blob URL for PDF preview
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    setPreviewUrl(pdfUrl);
    setIsPreviewOpen(true);
  };

  return (
    <Grid container alignItems="center" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <Grid container sx={{
        backgroundColor: 'rgb(249, 249, 249)', display: 'flex', width: '75vw', alignItems: 'center',
        justifyContent: 'center', padding: '20px', border: '1px solid black', borderRadius: '5px', mt: '15px', gap: '15px'
      }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            sx={{ width: { xs: '100%', sm: '75%', md: '50%', lg: '100%' } }}
            size="small"
            id="from-date"
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            sx={{ width: { xs: '100%', sm: '75%', md: '50%', lg: '100%' }, gap: '15px' }}
            size="small"
            id="to-date"
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Button variant="contained" color="primary" onClick={generatePDF}>Generate Report</Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container sx={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{
            height: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' },
            width: { xs: '90%', sm: '90%', md: '80%', lg: '70%' },
            display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            alignItems: 'center', justifyContent: 'center', gap: '25px'
          }}>
            <PieChart series={[{ data: [
              { id: 0, value: 100, label: 'series A' },
              { id: 1, value: 150, label: 'series B' },
              { id: 2, value: 120, label: 'series C' }
            ] }]} width={400} height={200} />
            <BarChart
              dataset={employees}
              xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
              series={[
                { dataKey: 'profit', label: 'Profit', valueFormatter, color: '#60e848' },
                { dataKey: 'loss', label: 'Loss', valueFormatter, color: '#e63544' }
              ]}
              {...chartSetting}
              width={450}
              height={300}
            />
          </Box>
        </Grid>
      </Grid>
      <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Preview PDF</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <iframe title="PDF Preview" src={previewUrl} width="100%" height="500" style={{ border: "none" }}></iframe>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Buttons for actions like sharing or downloading the PDF */}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Report;
