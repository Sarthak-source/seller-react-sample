import { Avatar, Box, Stack, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { ApiAppConstants, ip } from 'src/app-utils/api-constants';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import Iconify from 'src/components/iconify';
import { useDispatchTableFuctions } from './use-dispatch-table-fuctions';



export default function DoOrderTableRow({
    doNo,
    orderNo,
    invoiceNo,
    millName,
    name,
    date,
    vehicleNumber,
    quantity,
    billedTo,
    shipTo,
    rate,
    grade,
}) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();




    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const [expanded, setExpanded] = useState(false);

    const handleToggle = (val) => {
        setExpanded(val);
    };

    const { handlePrint } = useDispatchTableFuctions();
    const pdfUrl = `http://${ip}/${ApiAppConstants.getDoDoc}${doNo}`;

    const handleOpenDetails = (orderSelected) => {
        navigate(`/home/delivery-order-create/${orderSelected}`); // Use navigate to go to the details page
    };

    return (
        <>
            <TableRow
                onMouseEnter={() => handleToggle(true)}
                onMouseLeave={() => handleToggle(false)}
                hover tabIndex={-1} role="checkbox" >


                <TableCell
                    onClick={() => handleOpenDetails(orderNo)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderRadius = '8px';
                        e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {orderNo}
                </TableCell>
                <TableCell>{invoiceNo}</TableCell>
                <TableCell>{doNo}</TableCell>
                <TableCell component="th" scope="row" padding="normal" >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={millName} src='avatarUrl' />
                        <Typography variant="subtitle2" noWrap>
                            {millName}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{vehicleNumber}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell >
                    {expanded ? (
                        <Box >
                            {billedTo}
                        </Box>
                    ) : (
                        <Box style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '140px' }}>
                            {billedTo}
                        </Box>
                    )}
                </TableCell>

                <TableCell >
                    {expanded ? (
                        <Box>
                            {shipTo}
                        </Box>
                    ) : (
                        <Box style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '140px' }}>
                            {shipTo}
                        </Box>
                    )}
                </TableCell>
                <TableCell>{rate}</TableCell>
                <TableCell>{grade}</TableCell>
                <TableCell
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.grey[200];
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.common.white;
                    }}
                    align="right" style={{ position: 'sticky', right: 0, zIndex: 0, backgroundColor: theme.palette.common.white }}>
                    <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }} >

                        <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.success.main}>
                            <Iconify icon="lets-icons:print" />
                            <Box sx={{ fontWeight: 'bold' }}> Print </Box>
                        </HoverExpandButton>

                        <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.info.main}>
                            <Iconify icon="fluent:mail-24-filled" />
                            <Box sx={{ fontWeight: 'bold' }}> Mail </Box>
                        </HoverExpandButton>


                        <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.error.main}>
                            <Iconify icon="basil:cancel-solid" />
                            <Box sx={{ fontWeight: 'bold' }}> Cancel </Box>
                        </HoverExpandButton>

                    </Box>
                </TableCell>
            </TableRow>


        </>
    );
}

DoOrderTableRow.propTypes = {
    doNo: PropTypes.string,
    orderNo: PropTypes.string,
    invoiceNo: PropTypes.string,
    millName: PropTypes.string,
    name: PropTypes.string,
    date: PropTypes.string,
    vehicleNumber: PropTypes.string,
    quantity: PropTypes.string,
    billedTo: PropTypes.string,
    shipTo: PropTypes.string,
    rate: PropTypes.string,
    grade: PropTypes.string,
};
