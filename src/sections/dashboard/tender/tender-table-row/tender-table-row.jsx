import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useTheme } from '@emotion/react';
import { Alert, Box, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import AlertDialog from 'src/components/dialogs/action-dialog';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useTenderTableFormat } from '../use-tender-table-formate';


// ----------------------------------------------------------------------

export default function TenderTableRow({
  tenderId,
  name,
  location,
  date,
  price,
  status,
  tenderType,
  productType,
  grade,
  season,
  total,
  sold,
  balance,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [content, setContent] = useState('');
  const [statusType, setStatusType] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const selectedUser = useSelector((state) => state.user.selectedUser);


  const handleOpenDetails = () => {
    navigate(`/home/tender-details/${tenderId}`); // Use navigate to go to the details page
  };


  const handleAddTenderToSap = () => {
    navigate(`add-tender-to-sap`);
  }

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
      const data = await NetworkRepository.tenderUpdate(tenderId, statusConfirm, selectedUser.id);
      console.log('Response:', data);
      // Show success Snackbar or any other desired action
      showSnackbar('Tender updated successfully.', 'success');

    } catch (error) {
      console.error('Error:', error);
      // Show error Snackbar or handle the error accordingly
      showSnackbar('Something went wrong. Please try again.', 'error');

    } finally {
      setOpen(null);
    }
  };

  const handleClose = () => {
    setOpen(null);
  };

  const theme = useTheme();

  console.log('theme', theme.palette)


  console.log('status', status)



  const { getStatusColor, getStatus } = useTenderTableFormat();


  return (
    <>
      <TableRow
        hover tabIndex={-1} role="checkbox">
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}
        <TableCell
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={handleOpenDetails}
        >{tenderId}</TableCell>
        <TableCell component="th" scope="row" padding="normal" >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src='avatarUrl' />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{location}</TableCell>
        <TableCell>{date}</TableCell>
        <TableCell>
          <Typography variant="subtitle4" noWrap>
            {price}
          </Typography>
        </TableCell>
        <TableCell>
          <Label color={getStatusColor(status)}>{getStatus(status)}</Label>
        </TableCell>
        <TableCell>{tenderType}</TableCell>
        <TableCell>{productType}</TableCell>
        <TableCell>{grade}</TableCell>
        <TableCell>{season}</TableCell>
        <TableCell>{total}</TableCell>
        <TableCell>{sold}</TableCell>
        <TableCell>{balance}</TableCell>
        <TableCell

          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.grey[200];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.common.white;
          }}
          align="right" style={{ position: 'sticky', right: 0, zIndex: 0, backgroundColor: theme.palette.common.white }}>
          <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }} >
            {
              status === 'Added' && (
                <HoverExpandButton onClick={() => handleOpen('Make this tender active?', 'Active')} width='100px' color={theme.palette.success.main} >
                  <Iconify icon="material-symbols:order-approve-rounded" />
                  <Box sx={{ fontWeight: 'bold' }}> Active</Box>
                </HoverExpandButton>
              )
            }
            {status === 'Added' && (
              <HoverExpandButton onClick={() => handleOpen(`Are you sure you wan't to reject this tender?`, 'Rejected')} width='100px' color={theme.palette.error.main}>
                <Iconify icon="mdi:file-remove" />
                <Box sx={{ fontWeight: 'bold' }}> Reject
                </Box>
              </HoverExpandButton>
            )}
            {status === 'Active' && (
              <HoverExpandButton onClick={() => handleOpen(`Are you sure you wan't to close this tender?`, 'Close')} width='100px' color={theme.palette.error.main}>
                <Iconify icon="mdi:file-remove" />
                <Box sx={{ fontWeight: 'bold' }}> Close</Box>
              </HoverExpandButton>
            )}
            <HoverExpandButton onClick={() => handleAddTenderToSap()} width='130px' color={theme.palette.success.main}>
              <Iconify icon="logos:sap" />
              <Box sx={{ fontWeight: 'bold' }}> Add to SAP</Box>
            </HoverExpandButton>

          </Box>
        </TableCell>
      </TableRow>
      <AlertDialog
        content={content}
        isDialogOpen={open}
        handleConfirm={() => handleConfirm(statusType)}
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

TenderTableRow.propTypes = {
  tenderId: PropTypes.any,
  name: PropTypes.any,
  location: PropTypes.any,
  date: PropTypes.any,
  price: PropTypes.any,
  status: PropTypes.any,
  tenderType: PropTypes.any,
  productType: PropTypes.any,
  grade: PropTypes.any,
  season: PropTypes.any,
  total: PropTypes.any,
  sold: PropTypes.any,
  balance: PropTypes.any,
};
