import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

export default function OutboundTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [outbounds, setOutboundData] = useState([]);

  const handleOpenOutboundTable = () => {
    router.replace('/home/warehouse-management/add-outbound-form');
  };

  useEffect(() => {
    const fetchOutboundBatchData = async () => {
      try {
        setLoading(true);
        const response = await NetworkRepository.getOutboundList();
        const data = response || [];
        setOutboundData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOutboundBatchData();
  }, []);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Outbound
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenOutboundTable}>
          Add Outbound
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Outbound #</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sale Order No</TableCell>
              <TableCell>To Warehouse</TableCell>
              <TableCell>Created by</TableCell>
              <TableCell>Approved by</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outbounds.Outbound_data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.outbound_num}</TableCell>
                <TableCell>{order.ware_house.name}</TableCell>
                <TableCell>{order.outbound_type}</TableCell>
                <TableCell>{order.sale_order_num || 'N/A'}</TableCell>
                <TableCell>{order.to_warehouse ? order.to_warehouse.name : 'N/A'}</TableCell>
                <TableCell>{order.created_by}</TableCell>
                <TableCell>{order.approved_by || 'N/A'}</TableCell>
                <TableCell>{order.is_active}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
