import { Box, Button, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { updateOutbound } from 'src/redux/actions/warehouse-update-action';
import { useRouter } from 'src/routes/hooks';
import TableHeader from '../table-header';

export default function OutboundTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);

  const [outbounds, setOutboundData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState('');


  const handleOpenOutboundTable = () => {
    dispatch(updateOutbound({}));
    router.replace('/home/warehouse-management/add-outbound-form');
  };

  const handleUpdateOutboundTable = (row) => {
    dispatch(updateOutbound(row));
    router.replace('/home/warehouse-management/add-outbound-form');
  };

  const handleApprove = async (order) => {

    setTimeout(() => {
      setOutboundData([]);
      setReloading(prev => !prev);
    }, 3000);

    try {
      await NetworkRepository.outboundApprove({ id: order.id, updated_by: selectedUserConfig.seller.user });
      setSnackbarMessage('Outbound order approved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error approving outbound:', error);
      setSnackbarMessage('Failed to approve outbound order.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setReloading(false);
    }
  };



  useEffect(() => {
    const fetchOutboundBatchData = async () => {
      try {
        setLoading(true);
        const response = await NetworkRepository.getOutboundList(selectedUserConfig.seller.id, selectedOption);
        const data = response || [];
        setOutboundData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOutboundBatchData();
  }, [reloading, selectedUserConfig,selectedOption]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  console.log('outbounds', outbounds);

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
      <TableHeader
        selectedUser={selectedUserConfig.seller}
        selectedOption={selectedOption}
        handleSelectChange={handleSelectChange}
      />
      {loading ? (
        <SkeletonLoader marginTop='-100' />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Outbound #</TableCell>
                <TableCell>Mill</TableCell>
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
              {outbounds.Outbound_data?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.outbound_num}</TableCell>
                  <TableCell>{order.ware_house.mill.name}</TableCell>
                  <TableCell>{order.ware_house.name}</TableCell>
                  <TableCell>{order.outbound_type}</TableCell>
                  <TableCell>{order.sale_order_num || 'N/A'}</TableCell>
                  <TableCell>{order.to_warehouse ? order.to_warehouse.name : 'N/A'}</TableCell>
                  <TableCell>{order.created_by.first_name || order.created_by.username || 'N/A'}</TableCell>
                  <TableCell>{order.approved_by ? (order.approved_by.first_name || order.approved_by.username) : 'N/A'}</TableCell>
                  <TableCell>
                    <Label>
                      {order.is_active === 'Active' ? 'Active' : 'Inactive'}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row">
                      <IconButton onClick={() => handleUpdateOutboundTable(order)}>
                        <Iconify icon="eva:edit-fill" />
                      </IconButton>
                      <IconButton disabled={order.approved_date} onClick={() => handleApprove(order)}>
                        <Iconify icon="material-symbols:order-approve" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
