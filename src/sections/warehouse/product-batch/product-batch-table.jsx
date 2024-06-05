import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';


export default function ProductsBatch() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [productData, setProductData] = useState([]);
  


  

  const handleOpenProduct = () => {
    console.log('handleOpenProduct')
    router.replace('/home/warehouse-management/add-product-form');
  }


  useEffect(() => {
    console.log('sdfsdfsdf')
    const fetchProductBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getProductBatchList('');
        setProductData(data);

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    fetchProductBatchData();
  }, []);


  console.log('productDataMFD', productData)



  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Products batch
        </Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenProduct}>
          Add products batch
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Batch no</TableCell>
              <TableCell>start date</TableCell>
              <TableCell>end date </TableCell>
              <TableCell>status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.batch_num}</TableCell>
                <TableCell>{new Date(product.batch_start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(product.batch_end_date).toLocaleDateString()}</TableCell>
                <TableCell>{product.is_active}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


