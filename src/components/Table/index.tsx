import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AxiosInstance, AxiosResponse } from 'axios';
import { IFormInput } from 'src/pages/Messaging/Whatsapp';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

interface Props {
  data: IFormInput[];
}

export default function BasicTable({ data }: Props) {
  console.log(data);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#bfe5c7' }}>
            <TableCell
              align="center"
              sx={{
                borderRight: '1px solid #e0e0e0',
                fontSize: 15
              }}
            >
              Sender
            </TableCell>
            <TableCell
              align="left"
              sx={{ borderRight: '1px solid #e0e0e0', fontSize: 15 }}
            >
              Message
            </TableCell>
            <TableCell align="left" sx={{ fontSize: 15 }}>
              Receiver
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.sender}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                align="center"
                sx={{ borderRight: '1px solid #e0e0e0' }}
              >
                {row.sender}
              </TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #e0e0e0' }}>
                {row.message}
              </TableCell>
              <TableCell align="left">{row.receivers.join(',')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
