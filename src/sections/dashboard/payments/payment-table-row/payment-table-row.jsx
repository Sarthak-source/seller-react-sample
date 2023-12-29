import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import { useState } from 'react';


import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Avatar, Box, Stack, Typography } from '@mui/material';
import HoverExpandButton from 'src/components/buttons/expanded-button';
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


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const { getStatusColor } = usePaymentTableFormate();
  console.log('status', status)

  return (
    <>
      <TableRow sx={{ height: 25 }} hover tabIndex={-1} role="checkbox">
        <TableCell>{paymentsId}</TableCell>
        <TableCell>{amount}</TableCell>
        <TableCell>{refNo}</TableCell>
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
        {/* <TableCell>{remitter}</TableCell> */}
        <TableCell>{date}</TableCell>
        <TableCell align="right">
          <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }} >
            {status === 'Processed' && (
              <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.success.main}>
                <Iconify icon="mdi:file-remove" />
                <Box sx={{ fontWeight: 'bold' }}> Verify </Box>
              </HoverExpandButton>
            )}
            {
              status === 'Processed' && (
                <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.error.main} >
                  <Iconify icon="material-symbols:order-approve-rounded" />
                  <Box sx={{ fontWeight: 'bold' }}> Cancel </Box>
                </HoverExpandButton>
              )
            }
            {status === 'Verified' && (
              <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.info.main}>
                <Iconify icon="material-symbols:assignment-return" />
                <Box sx={{ fontWeight: 'bold' }}> Return </Box>
              </HoverExpandButton>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
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
