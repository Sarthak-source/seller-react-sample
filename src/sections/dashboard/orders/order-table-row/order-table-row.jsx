import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function OrdersTableRow({
    ordersId,
    millName,
    traderName,
    date,
    status,
    price,
    tenderType,
    productType,
    grade,
    season,
    sale,
    loading,
    dispatched,
    balance
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
                <TableCell>{ordersId}</TableCell>
                <TableCell>{millName}</TableCell>
                <TableCell>{traderName}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>
                    <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
                </TableCell>
                <TableCell>{price}</TableCell>
                <TableCell>{tenderType}</TableCell>
                <TableCell>{productType}</TableCell>
                <TableCell>{grade}</TableCell>
                <TableCell>{season}</TableCell>
                <TableCell>{sale}</TableCell>
                <TableCell>{loading}</TableCell>
                <TableCell>{dispatched}</TableCell>
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

OrdersTableRow.propTypes = {
    ordersId: PropTypes.string,
    millName: PropTypes.string,
    traderName: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.string,
    price: PropTypes.string,
    tenderType: PropTypes.string,
    productType:PropTypes.string,
    grade: PropTypes.string,
    season: PropTypes.string,
    sale: PropTypes.string,
    loading: PropTypes.string,
    dispatched: PropTypes.string,
    balance: PropTypes.string,
};
