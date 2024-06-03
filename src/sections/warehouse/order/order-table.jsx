import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const orders = [
  { id: 1, customer: 'Customer A', date: '2023-06-01', status: 'Shipped', total: 200 },
  { id: 2, customer: 'Customer B', date: '2023-06-02', status: 'Processing', total: 300 },
  // Add more orders as needed
];

export default function Orders() {
  const router = useRouter();


  const handleOpenOrders = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-order-form');

  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenOrders}>
          Add orders
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

