import PropTypes from 'prop-types';
import { useState } from 'react';

import Avatar from '@mui/material/Avatar';

import { useTheme } from '@emotion/react';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import AlertDialog from 'src/components/dialogs/action-dialog';
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
    const theme = useTheme();


    const handleOpenDetails = (orderSelected) => {
        dispatch(selectOrder(orderSelected))
        navigate(`/home/order-details/${ordersId}`); // Use navigate to go to the details page
    };

    const handleOpenVehicleAdd = (orderSelected) => {
        dispatch(selectOrder(orderSelected))
        navigate(`/home/add-vehicle/${ordersId}`); // Use navigate to go to the details page
    };

    const handleAddOrderToSap = () => {
        navigate(`add-order-to-sap`);
    }


    const [content, setContent] = useState('');
    const [statusType, setStatusType] = useState('');

    const [loadingButton, setLoading] = useState(false)

    const [nameController, setNameController] = useState('');
    const [numberController, setNumberController] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const selectedUser = useSelector((state) => state.user.selectedUser);


    const { getStatusColor } = useOrderTableFormate();

    const handleOpen = (contentType, statusArg) => {
        setOpen(true);
        setContent(contentType)
        setStatusType(statusArg)
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

    const handleConfirm = async (statusConfirm) => {
        try {
            const data = await NetworkRepository.orderUpdateStatus(ordersId, statusConfirm, selectedUser.id);
            console.log('Response:', data);
            showSnackbar('Order updated successfully.', 'success');
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
        } finally {
            setOpen(null);
        }
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleNameChange = (event) => {
        setNameController(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNumberController(event.target.value);
    };

    const closeDialog = () => {
        setOpenDialog(false)
        setNameController('')
        setNumberController('')
    };

    const addTransporter = async () => {
        try {
            setLoading(true)
            const data = await NetworkRepository.assignToTransporter(ordersId, nameController, numberController, selectedUser.id);
            console.log('Response:', data);
            showSnackbar('Transporter assigned successfully.', 'success');
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }

    }


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
                    onClick={() => handleOpenDetails(order)}>
                    {ordersId}
                </TableCell>
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
                <TableCell>
                    <Typography variant="subtitle4" noWrap>
                        {price}
                    </Typography>
                </TableCell>
                <TableCell>{tenderType}</TableCell>
                <TableCell>{productType}</TableCell>
                <TableCell>{grade}</TableCell>
                <TableCell>{season}</TableCell>
                <TableCell>{sale}</TableCell>
                <TableCell>{loading}</TableCell>
                <TableCell>{dispatched}</TableCell>
                <TableCell>{balance}</TableCell>
                <TableCell
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.grey[200];
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.common.white;
                    }}
                    align="right" style={{ position: 'sticky', right: 0, zIndex: 0, backgroundColor: theme.palette.common.white }}
                >
                    <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }} >
                        {status === 'Pending Approval' && (
                            <HoverExpandButton onClick={() => handleOpen('Are you sure you want to Accept?', 'Approved')} width='100px' color={theme.palette.success.main}>
                                <Iconify icon="material-symbols:order-approve-rounded" />
                                <Box sx={{ fontWeight: 'bold' }}> Accept</Box>
                            </HoverExpandButton>
                        )}
                        {
                            status === 'Pending Approval' && (
                                <HoverExpandButton onClick={() => handleOpen('Are you sure you want to Reject?', 'Rejected')} width='100px' color={theme.palette.error.main} >
                                    <Iconify icon="mdi:file-remove" />
                                    <Box sx={{ fontWeight: 'bold' }}> Reject</Box>
                                </HoverExpandButton>
                            )
                        }

                        {
                            tenderType === 'Offline' && status === 'Bid Accepted' && (
                                <HoverExpandButton onClick={() => handleOpenVehicleAdd(order)} width='130px' color={theme.palette.success.main} >
                                    <Iconify icon="mdi:truck-check" />
                                    <Box sx={{ fontWeight: 'bold' }}>Add vehicle</Box>
                                </HoverExpandButton>
                            )
                        }
                        {
                            tenderType === 'Offline' && status === 'Bid Accepted' && (
                                <HoverExpandButton onClick={() => setOpenDialog(true)} width='170px' color={theme.palette.info.main} >
                                    <Iconify icon="mdi:drivers-license" />
                                    <Box sx={{ fontWeight: 'bold' }}>Assign transporter</Box>
                                </HoverExpandButton>
                            )
                        }
                        {
                            status === 'Bid Accepted' && (
                                <HoverExpandButton onClick={() => handleOpen('Are you sure you want to Close?', 'Close')} width='90px' color={theme.palette.error.main} >
                                    <Iconify icon="mdi:file-remove" />
                                    <Box sx={{ fontWeight: 'bold' }}>Close</Box>
                                </HoverExpandButton>
                            )
                        }
                        {/* <HoverExpandButton onClick={() => handleAddOrderToSap()} width='130px' color={theme.palette.success.main}>
                            <Iconify icon="logos:sap" />
                            <Box sx={{ fontWeight: 'bold' }}> Add to SAP</Box>
                        </HoverExpandButton> */}
                    </Box>
                </TableCell>
            </TableRow>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Assign Transporter</DialogTitle>
                <DialogContent >
                    <TextField
                        name="remarks"
                        label="Transporter Name"
                        value={nameController}
                        onChange={handleNameChange}
                        fullWidth
                        sx={{ marginBottom: 2, marginTop: 2 }}
                    />
                    <TextField
                        name="number"
                        label="Enter transporter mobile number"
                        inputProps={{ maxLength: 10 }}
                        value={numberController}
                        onChange={handleNumberChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    {/* Your dialog content goes here */}
                </DialogContent>
                <DialogActions>
                    <LoadingButton loading={loadingButton} onClick={addTransporter}>Add</LoadingButton>
                    <LoadingButton onClick={closeDialog}>Cancel</LoadingButton>
                    {/* Additional action buttons if needed */}
                </DialogActions>
            </Dialog>
            <AlertDialog
                content={content}
                isDialogOpen={open}
                handleConfirm={() => handleConfirm(statusType)}
                handleClose={handleClose} />
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
