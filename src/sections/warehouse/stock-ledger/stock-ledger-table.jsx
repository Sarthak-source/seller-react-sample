import { Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { useRouter } from 'src/routes/hooks';

export default function StockLedgerTable() {
  const router = useRouter();
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const [loading, setLoading] = useState(true);
  const [stockLedger, setStockLedgerData] = useState([]);

  useEffect(() => {
    const fetchStockLedgerData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getStockLedgerList('', selectedUserConfig.seller.id);
        setStockLedgerData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockLedgerData();
  }, [selectedUserConfig]);

  console.log('stockLedger', stockLedger);

  const handleOpenStockLedgerTable = () => {
    console.log('handleOpenProduct');
    router.replace('/home/warehouse-management/add-order-form');
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Stock Ledger
        </Typography>
        
      </Stack>
      {loading ? ( 
        <SkeletonLoader  marginTop='-100'/>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SL no</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Inbound #</TableCell>
                <TableCell>Outbound #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Batch No</TableCell>
                <TableCell>QTY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockLedger.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.ware_house.name}</TableCell>
                  <TableCell>{entry.inbound ? entry.inbound.inbound_num : 'N/A'}</TableCell>
                  <TableCell>{entry.outbound ? entry.outbound.outbound_num : 'N/A'}</TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.product.code}</TableCell>
                  <TableCell>{entry.batch_num ? entry.batch_num.batch_num : 'N/A'}</TableCell>
                  <TableCell>{entry.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
