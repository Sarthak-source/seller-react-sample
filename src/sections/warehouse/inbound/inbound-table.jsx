import { Box, Button, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { updateInbound } from 'src/redux/actions/warehouse-update-action';
import { useRouter } from 'src/routes/hooks';

export default function InboundTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);

  const [inbounds, setInboundData] = useState([]);
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');


  const handleOpenInboundTable = () => {
    dispatch(updateInbound({}));

    router.replace('/home/warehouse-management/add-inbound-form');
  };

  const handleUpdateInboundTable = (row) => {
    dispatch(updateInbound(row));

    router.replace('/home/warehouse-management/add-inbound-form');
  };

  const handleApprove = async (order) => {
    setReloading(true)
    try {
      await NetworkRepository.inboundApprove({ id: order.id, updated_by: selectedUserConfig.seller.user, });
      setSnackbarSeverity('success');
      setSnackbarMessage('Inbound approved successfully');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to approve inbound');
      setSnackbarOpen(true);
      console.error('Error approving inbound:', error);
      setReloading(false)
    }
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
  }, [reloading]);


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
      {loading ? (
        <SkeletonLoader marginTop='-100' />
      ) : (<TableContainer component={Paper}>
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
                  <Stack direction="row">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleUpdateInboundTable(order)}>
                        <Iconify icon="eva:edit-fill" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Approve Inbound">
                      <IconButton disabled={order.approved_date} onClick={() => handleApprove(order)}>
                        <Iconify icon="material-symbols:order-approve" />
                      </IconButton>
                    </Tooltip>

                  </Stack>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>)}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
}
