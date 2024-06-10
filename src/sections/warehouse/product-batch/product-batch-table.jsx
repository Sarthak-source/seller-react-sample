import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { updateProductBatch } from 'src/redux/actions/warehouse-update-action';
import { useRouter } from 'src/routes/hooks';


export default function ProductsBatch() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);
  const dispatch = useDispatch();


  const handleOpenProduct = () => {
    console.log('handleOpenProduct')
    dispatch(updateProductBatch({}));
    router.replace('/home/warehouse-management/add-product-form');
  }

  const handleUpdateProduct = (row) => {
    dispatch(updateProductBatch(row));
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

      {loading ? (
        <SkeletonLoader marginTop='-100' />
      ) : (<TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Batch no</TableCell>
              <TableCell>start date</TableCell>
              <TableCell>end date </TableCell>
              <TableCell>status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData.map((product) => (
              <TableRow key={product.id}>
                <TableCell onMouseEnter={(e) => {
                  e.currentTarget.style.borderRadius = '8px';
                  e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }} onClick={() => handleUpdateProduct(product)}>
                  {product.id}
                </TableCell>
                <TableCell>{product.batch_num}</TableCell>
                <TableCell>{new Date(product.batch_start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(product.batch_end_date).toLocaleDateString()}</TableCell>
                <TableCell>{product.is_active}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleUpdateProduct(product)}>
                    <Iconify icon="eva:edit-fill" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>)}
    </Box>
  );
}


