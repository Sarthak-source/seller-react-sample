import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

export default function ProductsManufacturing() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const handleOpenProduct = () => {
    router.replace('/home/warehouse-management/add-product-mfg-form');
  }

  useEffect(() => {
    const fetchProductBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getProductBatchMFGList();
        setProductData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductBatchData();
  }, []);

  console.log('getProductBatchMFGList', productData);

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
              <TableCell>Batch No</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Mill Name</TableCell>
              <TableCell>Manufacturing Date</TableCell>
              <TableCell>Manufacturing Quantity</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.batch_num}</TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.mill_name}</TableCell>
                <TableCell>{new Date(product.mfg_date).toLocaleDateString()}</TableCell>
                <TableCell>{product.mfg_qty}</TableCell>
                <TableCell>{new Date(product.exp_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">Edit</Button>
                  <Button variant="contained" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
