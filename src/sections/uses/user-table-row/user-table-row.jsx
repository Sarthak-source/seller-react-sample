import {
  Avatar,
  Stack,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Label from 'src/components/label';
import { useUserTableFormat } from '../use-user-table-formate';

export default function UserTableRow({
  name,
  status,
  gstno,
  phoneNumber,
  email,
  mills,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { getStatusColor } = useUserTableFormat();

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu(); // Close the menu when opening the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={handleOpenDialog} component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src="avatarUrl" />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        {/* <TableCell>{gstno}</TableCell> */}
        <TableCell
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => handleCall(phoneNumber)}>{phoneNumber}</TableCell>
        {/* <TableCell
            onMouseEnter={(e) => {
              e.currentTarget.style.borderRadius = '8px';
              e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            >{email}</TableCell> */}
        <TableCell>
          <Label >{status}</Label>
        </TableCell>
        {/* <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell> */}
      </TableRow>
    </>
  );
}


UserTableRow.propTypes = {
  name: PropTypes.any,
  status: PropTypes.any,
  gstno: PropTypes.any,
  phoneNumber: PropTypes.any,
  email: PropTypes.any,
  mills: PropTypes.any,
};
