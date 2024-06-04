import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const stockLedgerTable = [
  { id: 1, customer: 'Customer A', date: '2023-06-01', status: 'Shipped', total: 200 },
  { id: 2, customer: 'Customer B', date: '2023-06-02', status: 'Processing', total: 300 },
  // Add more StockLedgerTable as needed
];

export default function StockLedgerTable() {
  const router = useRouter();


  const handleOpenStockLedgerTable = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-order-form');

  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          StockLedger
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenStockLedgerTable}>
          Add StockLedger
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL no</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>In bound #</TableCell>
              <TableCell>Out bound #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Batch No</TableCell>
              <TableCell>QTY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockLedgerTable.map((order) => (
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

