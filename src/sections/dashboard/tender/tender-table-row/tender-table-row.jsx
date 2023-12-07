import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

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

  const handleOpenDetails = () => {
    navigate(`/home/tender-details/${tenderId}`); // Use navigate to go to the details page
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };



  const { getStatusColor } = useTenderTableFormat();


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
            e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.5)';
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
        <TableCell>{price}</TableCell>
        <TableCell>
          <Label color={getStatusColor(status)}>{status}</Label>
        </TableCell>
        <TableCell>{tenderType}</TableCell>
        <TableCell>{productType}</TableCell>
        <TableCell>{grade}</TableCell>
        <TableCell>{season}</TableCell>
        <TableCell>{total}</TableCell>
        <TableCell>{sold}</TableCell>
        <TableCell>{balance}</TableCell>
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
