import PropTypes from 'prop-types';
import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { selectOrder } from 'src/redux/actions/order-actions';
import { useOrderTableFormate } from '../use-order-table-formate';

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
    balance,
    order,
}) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleOpenDetails = (orderSelected) => {
        dispatch(selectOrder(orderSelected))
        navigate(`/home/order-details/${ordersId}`); // Use navigate to go to the details page
    };

    const { getStatusColor } = useOrderTableFormate();


    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox">
                <TableCell onClick={() => handleOpenDetails(order)}>{ordersId}</TableCell>
                <TableCell component="th" scope="row" padding="normal" >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={millName} src='avatarUrl' />
                        <Typography variant="subtitle2" noWrap>
                            {millName}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell>{traderName}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>
                    <Label color={getStatusColor(status)}>{status}</Label>
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
    ordersId: PropTypes.number,
    millName: PropTypes.string,
    traderName: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.string,
    price: PropTypes.string,
    tenderType: PropTypes.string,
    productType: PropTypes.string,
    grade: PropTypes.string,
    season: PropTypes.string,
    sale: PropTypes.string,
    loading: PropTypes.string,
    dispatched: PropTypes.string,
    balance: PropTypes.string,
    order: PropTypes.string,
};
