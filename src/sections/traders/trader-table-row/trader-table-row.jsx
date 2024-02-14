import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useTraderTableFormat } from '../use-trader-table-formate';

export default function TraderTableRow({
  name,
  status,
  gstno,
  phoneNumber,
  email,
  mills,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { getStatusColor } = useTraderTableFormat();

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


  const handleMapDialog = () => {
    if (mills.length > 0) {
      const mill = mills[0]; // Assuming you want to open the map for the first mill
      const lat = parseFloat(mill.latitude);
      const long = parseFloat(mill.longitude);
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleSendEmail = (mail) => {
    const subject = 'Email subject';
    const body = 'Email body';
    const mailtoLink = `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
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
        <TableCell>{gstno}</TableCell>
        <TableCell
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => handleCall(phoneNumber)}>{phoneNumber}</TableCell>
        <TableCell
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => handleSendEmail(email)}>{email}</TableCell>
        <TableCell>
          <Label color={getStatusColor(status)}>{status}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!openMenu}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpenDialog}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Mills associated with this trader</DialogTitle>
        <DialogContent>
          <List>
            {mills.map((mill, index) => (
              <React.Fragment key={index}>
                <ListItem dense onClick={handleMapDialog}>
                  <ListItemAvatar>
                    <Avatar alt={mill.name} src={mill.institution} />
                  </ListItemAvatar>
                  <ListItemText primaryTypographyProps={{ fontWeight: "bold" }} primary={mill.name} secondary={mill.gstin} sx={{ pr: 12 }} />
                  <Iconify icon="iconamoon:location-duotone" />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          {/* Add more buttons or actions as needed */}
        </DialogActions>
      </Dialog>
    </>
  );
}


TraderTableRow.propTypes = {
  name: PropTypes.any,
  status: PropTypes.any,
  gstno: PropTypes.any,
  phoneNumber: PropTypes.any,
  email: PropTypes.any,
  mills: PropTypes.any,
};
