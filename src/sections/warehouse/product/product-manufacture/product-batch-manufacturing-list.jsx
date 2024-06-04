import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const products = [
  { id: 1, name: 'Product A', category: 'Category 1', price: 100, stock: 20 },
  { id: 2, name: 'Product B', category: 'Category 2', price: 150, stock: 15 },
  // Add more products as needed
];

export default function ProductsManufacturing() {
  const router = useRouter();


  const handleOpenProduct = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-product-form');
  }



  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Products MFG
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenProduct}>
          Add products MFG
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Plant</TableCell>
              <TableCell>Address </TableCell>
              <TableCell>MFG Date</TableCell>
              <TableCell>MFG QTY</TableCell>
              <TableCell>Batch no</TableCell>
              <TableCell>Exp date</TableCell>
              <TableCell>Action</TableCell>


            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


