import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const warehouseView = [
  { id: 1, product: 'Product A', location: 'Warehouse 1', quantity: 50 },
  { id: 2, product: 'Product B', location: 'Warehouse 2', quantity: 30 },
  // Add more WarehouseView items as needed
];

export default function WarehouseTableView() {
  const router = useRouter();


  const handleOpenWarehouseView = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-WarehouseView-form');

  }

  return (
    <Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Warehouse
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenWarehouseView}>
          Add Warehouse
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Plant</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouseView.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

