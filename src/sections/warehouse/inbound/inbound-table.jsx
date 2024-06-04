import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const inboundTable = [
  { id: 1, customer: 'Customer A', date: '2023-06-01', status: 'Shipped', total: 200 },
  { id: 2, customer: 'Customer B', date: '2023-06-02', status: 'Processing', total: 300 },
  // Add more InboundTable as needed
];

export default function InboundTable() {
  const router = useRouter();


  const handleOpenInboundTable = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-order-form');

  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Inbound
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenInboundTable}>
          Add Inbound
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inbound #</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sale Order No</TableCell>
              <TableCell>To Warehouse</TableCell>
              <TableCell>Created by</TableCell>
              <TableCell>Approved by</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inboundTable.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

