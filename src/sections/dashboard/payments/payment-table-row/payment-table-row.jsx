import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import { useState } from 'react';


import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Alert, Avatar, Box, Snackbar, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import AlertDialog from 'src/components/dialogs/action-dialog';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { usePaymentTableFormate } from '../use-payment-table-formate';

export default function PaymentsTableRow({
  paymentsId,
  amount,
  status,
  millName,
  price,
  tradeName,
  remitter,
  date,
  refNo
}) {
  const [open, setOpen] = useState(null);
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [content, setContent] = useState('');
  const [statusType, setStatusType] = useState('');
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleOpen = (contentType, statusArg) => {
    setOpen(true);
    setContent(contentType)
    setStatusType(statusArg)

  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleConfirm = async (statusConfirm) => {
    try {
      const data = await NetworkRepository.paymentHeadUpdateStatus(paymentsId, statusConfirm,selectedUser.id);
      console.log('Response:', data);
      showSnackbar('Payment updated successfully.', 'success');
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Something went wrong. Please try again.', 'error');

    } finally {
      setOpen(null);
    }
  };

  const { getStatusColor } = usePaymentTableFormate();
  console.log('status', status)

  return (
    <>
      <TableRow sx={{ height: 25 }} hover tabIndex={-1} role="checkbox">
        <TableCell>{date}</TableCell>
        <TableCell>{paymentsId}</TableCell>
        <TableCell>{amount}</TableCell>

        <TableCell>
          <Label color={getStatusColor(status)}>{status}</Label>
        </TableCell>
        <TableCell component="th" scope="row" padding="normal" >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={millName} src='avatarUrl' />
            <Typography variant="subtitle2" noWrap>
              {millName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{tradeName}</TableCell>
        <TableCell>{refNo}</TableCell>
        {/* <TableCell>{remitter}</TableCell> */}

        <TableCell
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.grey[200];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.common.white;
          }}
          align="right" style={{ position: 'sticky', right: 0, zIndex: 0, backgroundColor: theme.palette.common.white }}>
          <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }} >
            {status === 'Processed'  && (
              <HoverExpandButton onClick={() => handleOpen(`Are you sure you want to Verify?`, 'Verified')} width='100px' color={theme.palette.success.main}>
                <Iconify icon="material-symbols:order-approve-rounded" />
                <Box sx={{ fontWeight: 'bold' }}> Verify </Box>
              </HoverExpandButton>
            )}
            {
              status === 'Processed' && (
                <HoverExpandButton onClick={() => handleOpen(`Are you sure you want to Cancel?`, 'Cancel')} width='100px' color={theme.palette.error.main} >
                  <Iconify icon="mdi:file-remove" />
                  <Box sx={{ fontWeight: 'bold' }}> Cancel </Box>
                </HoverExpandButton>
              )
            }
            {status === 'Verified' && (
              <HoverExpandButton onClick={() => handleOpen(`Are you sure you want to Return?`, 'Returned')} width='100px' color={theme.palette.info.main}>
                <Iconify icon="majesticons:arrow-right-circle" />
                <Box sx={{ fontWeight: 'bold' }}> Return </Box>
              </HoverExpandButton>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <AlertDialog
        content={content}
        isDialogOpen={open}
        handleConfirm={()=>handleConfirm(statusType)}
        handleClose={handleClose} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

PaymentsTableRow.propTypes = {
  paymentsId: PropTypes.any,
  amount: PropTypes.any,
  status: PropTypes.any,
  millName: PropTypes.any,
  price: PropTypes.any,
  tradeName: PropTypes.any,
  remitter: PropTypes.any,
  date: PropTypes.any,
  refNo: PropTypes.any,
};
