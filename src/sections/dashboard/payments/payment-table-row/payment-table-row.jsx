import PropTypes from 'prop-types';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

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
  
    const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
    };
  
    const handleCloseMenu = () => {
      setOpen(null);
    };
  
    return (
      <>
        <TableRow hover tabIndex={-1} role="checkbox">
          <TableCell>{paymentsId}</TableCell>
          <TableCell>{amount}</TableCell>
          <TableCell>{refNo}</TableCell>
          <TableCell>
            <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
          </TableCell>
          <TableCell>{millName}</TableCell>
          <TableCell>{tradeName}</TableCell>
          {/* <TableCell>{remitter}</TableCell> */}
          <TableCell>{date}</TableCell>
          
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
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
  