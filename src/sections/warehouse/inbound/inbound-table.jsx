import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { updateInbound } from 'src/redux/actions/warehouse-update-action';
import { useRouter } from 'src/routes/hooks';

export default function InboundTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inbounds, setInboundData] = useState([]);
  const dispatch = useDispatch();


  const handleOpenInboundTable = () => {
    dispatch(updateInbound({}));

    router.replace('/home/warehouse-management/add-inbound-form');
  };

  const handleUpdateInboundTable = (row) => {
    dispatch(updateInbound(row));

    router.replace('/home/warehouse-management/add-inbound-form');
  };

  useEffect(() => {
    const fetchInboundBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getInboundList();
        setInboundData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInboundBatchData();
  }, []);


  console.log('datadata', inbounds)

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Inbound
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenInboundTable}>
          Add Inbound
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inbound #</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sale Order No</TableCell>
              <TableCell>To Warehouse</TableCell>
              <TableCell>Created by</TableCell>
              <TableCell>Approved by</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {inbounds.inbound_data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.inbound_num}</TableCell>
                <TableCell>{order.ware_house.name}</TableCell>
                <TableCell>{order.inbound_type}</TableCell>
                <TableCell>{order.po_num || 'N/A'}</TableCell>
                <TableCell>{order.from_warehouse ? order.from_warehouse.name : 'N/A'}</TableCell>
                <TableCell>{order.created_by}</TableCell>
                <TableCell>{order.approved_by || 'N/A'}</TableCell>
                <TableCell>{order.is_active}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleUpdateInboundTable(order)}>
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
