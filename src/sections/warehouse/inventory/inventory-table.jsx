import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const inventory = [
  { id: 1, product: 'Product A', location: 'Warehouse 1', quantity: 50 },
  { id: 2, product: 'Product B', location: 'Warehouse 2', quantity: 30 },
  // Add more inventory items as needed
];

export default function Inventory() {
  const router = useRouter();


  const handleOpenInventory = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-inventory-form');

  }

  return (
    <Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenInventory}>
          Add Inventory
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

