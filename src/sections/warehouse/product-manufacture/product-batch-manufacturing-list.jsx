import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { updateProductMFGbatch } from 'src/redux/actions/warehouse-update-action';
import { useRouter } from 'src/routes/hooks';

export default function ProductsManufacturing() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);
  const dispatch = useDispatch();


  const handleOpenProduct = () => {
    dispatch(updateProductMFGbatch({}));
    router.replace('/home/warehouse-management/add-product-mfg-form');
  }

  const handleUpdateProduct = (row) => {
    dispatch(updateProductMFGbatch(row));
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
                <TableCell align="right">
                  <IconButton onClick={() => handleUpdateProduct(product)}>
                    <Iconify icon="eva:edit-fill" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
