import PropTypes from 'prop-types';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Iconify from 'src/components/iconify';

export default function DispatchTableRow({
    orderNo,
    invoiceNo,
    millName,
    orderType,
    date,
    vehicleNumber,
    quantity,
    billedTo,
    ShipTo,
    rate,
    grade,
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
                <TableCell>{orderNo}</TableCell>
                <TableCell>{invoiceNo}</TableCell>
                <TableCell>{millName}</TableCell>
                <TableCell>{orderType}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{vehicleNumber}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>{billedTo}</TableCell>
                <TableCell>{ShipTo}</TableCell>
                <TableCell>{rate}</TableCell>
                <TableCell>{grade}</TableCell>
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

DispatchTableRow.propTypes = {
    orderNo: PropTypes.string,
    invoiceNo: PropTypes.string,
    millName: PropTypes.string,
    orderType: PropTypes.string,
    date: PropTypes.string,
    vehicleNumber: PropTypes.string,
    quantity: PropTypes.string,
    billedTo: PropTypes.string,
    ShipTo: PropTypes.string,
    rate: PropTypes.string,
    grade: PropTypes.string,
};
