import {
  Avatar,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAddressTableFormat } from '../use-address-table-formate';

export default function AddressTableRow({
  id, // Assuming id is passed to uniquely identify each address
  name,
  gstin,
  address,
  location,
  pin,
  onEdit // Function to handle edit action
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { getStatusColor } = useAddressTableFormat();

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };


  const handleEdit = () => {
    onEdit();
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
         onClick={handleEdit}>
           <Tooltip title={`Edit address of ${name}`}>

           <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src="avatarUrl" />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>

           </Tooltip>
          
        </TableCell>
        <TableCell>{gstin}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{location}</TableCell>
        <TableCell>{pin}</TableCell>
        
      </TableRow>
    </>
  );
}

AddressTableRow.propTypes = {
  id: PropTypes.string, // Add prop type for id
  name: PropTypes.any,
  gstin: PropTypes.any,
  address: PropTypes.any,
  location: PropTypes.any,
  pin: PropTypes.any,
  onEdit: PropTypes.func // Add prop type for onEdit function
};
