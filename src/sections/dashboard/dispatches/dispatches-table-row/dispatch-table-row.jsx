import PropTypes from 'prop-types';
import { useState } from 'react';

import { Alert, Avatar, Box, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { ApiAppConstants, ip } from 'src/app-utils/api-constants';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useDispatchTableFuctions } from './use-dispatch-table-fuctions';

export default function DispatchTableRow({
    type,
    orderNo,
    invoiceNo,
    lrNum,
    lrId,
    millName,
    name,
    date,
    vehicleNumber,
    quantity,
    billedTo,
    shipTo,
    rate,
    grade,
    qcStatus,
}) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


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

    const handleOpenDetails = (orderSelected) => {
        navigate(`/home/loading-instruction-details/${orderSelected}`); // Use navigate to go to the details page
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editedLrNum, setEditedLrNum] = useState(lrNum);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await NetworkRepository.lrUpdate(lrId, editedLrNum);
            showSnackbar('LR number updated successfully.', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('An error occurred while saving:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
        } finally {
            setEditedLrNum(editedLrNum)
        }
    };


    const handleCancel = () => {
        // Cancel editing, reset the editedLrNum to the original lrNum
        setEditedLrNum(lrNum);
        setIsEditing(false);
    };

    const { handlePrint, getStatusColor, getStatus } = useDispatchTableFuctions();
    const pdfUrl = `http://${ip}/${ApiAppConstants.getInvoiceDoc}${orderNo}`;

    console.log('lrId', lrId)

    return (
        <>
            <TableRow
                onMouseEnter={() => handleToggle(true)}
                onMouseLeave={() => handleToggle(false)}
                hover tabIndex={-1} role="checkbox">
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
                >{orderNo}</TableCell>
                <TableCell>
                    {isEditing ? (
                        <Stack direction="row" alignItems="center">
                            <TextField
                                value={editedLrNum}
                                style={{ width: `calc(${editedLrNum.length}ch + 30px)`, boxSizing: 'border-box' }}
                                onChange={(e) => setEditedLrNum(e.target.value)}
                            />
                            <Tooltip title="Change LR number">
                                <IconButton onClick={handleSave} >
                                    <Iconify icon="lets-icons:check-fill" color="primary.main" sx={{ width: 25, height: 25 }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Cancel">
                                <IconButton onClick={handleCancel}>
                                    <Iconify icon="basil:cancel-outline" color="error.main" sx={{ width: 25, height: 25, ml: -1 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    ) : (
                        <Stack direction="row" alignItems="center">
                            {editedLrNum}
                            <Tooltip title="Edit LR number">
                                <IconButton onClick={handleEdit} >
                                    <Iconify icon="basil:edit-outline" color="primary.main" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}
                </TableCell>

                {type === 'loadingsInstruction' && (
                    <TableCell>
                        <Label color={getStatusColor(qcStatus)}>{getStatus(qcStatus)}</Label>
                    </TableCell>

                )}

                {type === 'invoice' && (<TableCell>{invoiceNo}</TableCell>)}
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
                <MenuItem onClick={() => handlePrint(pdfUrl)}>
                    <Iconify icon="lets-icons:print" sx={{ mr: 2 }} />
                    Print
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                    <Iconify icon="fluent:calendar-cancel-24-regular" sx={{ mr: 2 }} />
                    Cancel
                </MenuItem>
            </Popover>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

DispatchTableRow.propTypes = {
    type: PropTypes.string,
    orderNo: PropTypes.string,
    lrNum: PropTypes.string,
    lrId: PropTypes.string,
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
    qcStatus: PropTypes.string,
};
