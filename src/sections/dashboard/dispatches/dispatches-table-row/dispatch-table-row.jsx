import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { fCurrency } from "src/utils/format-number";

import { Alert, Avatar, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, Stack, Table, TableBody, TableContainer, TableHead, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ApiAppConstants, ip } from 'src/app-utils/api-constants';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import AlertDialog from 'src/components/dialogs/action-dialog';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { selectState } from 'src/redux/actions/state-refresh';
import { useDispatchTableFuctions } from './use-dispatch-table-fuctions';

export default function DispatchTableRow({
    type,
    subtype,
    orderNo,
    doPk,
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
    loadingInstructions
}) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const theme = useTheme();
    const pdfContainerRef = useRef();
    const isMounted = useRef(true); // Add this line
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const [content, setContent] = useState('');
    const [statusType, setStatusType] = useState('');
    const [openTaxDialog, setTaxDialog] = useState('');
    const [loading, setLoading] = useState('');

    const [balance, setBalance] = useState();

    const dispatch = useDispatch();
    const currentState = useSelector((state) => state.stateRefreash.currentState);


    console.log('DispatchTableRow loadingInstructions', loadingInstructions?.status)



    // Check if loadingInstructions is not undefined and is an array
    const ids = loadingInstructions?.loading_instruction && Array.isArray(loadingInstructions.loading_instruction)
        ? loadingInstructions?.loading_instruction.map(({ id }) => id)
        : [];

    console.log(ids)

    const handleOpen = async (contentType, statusArg) => {


        console.log('handleOpen',statusArg)

        if (statusArg === 'Approve') {

            setOpen(true);
            setContent(contentType)
            setStatusType(statusArg)
        } else if (statusArg === 'Issue DO') {
            console.log(statusArg)
            console.log(statusArg)
            setOpen(true);
            setContent(contentType)
            setStatusType(statusArg)


        } else {
            setOpen(true);
            setContent(contentType)
            setStatusType(statusArg)
        }
    }

    const handleClose = () => {
        setTaxDialog(null);
        setOpen(null);
    };


    const handleConfirm = async (status) => {
        try {
            if (!selectedUser || !selectedUser.id) {
                console.error('Selected user or user ID is missing');
                return;
            }

            const data = await NetworkRepository.loadingInstructionUpdate({
                orderId: ids,
                qty: quantity,
                status,
                sellerId: selectedUser.id
            });

            console.log('make it matter', data);

            if (data instanceof Error && data.response && data.response.status === 400) {
                console.log('make it matter', data.response.data);
                setBalance(data.response.data);
                setTaxDialog(true);
            }

        } catch (error) {
            console.error('Error updating loading instruction:', error);
            setTaxDialog(true);
        }
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
    const [pdfData, setPdfData] = useState(null);

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

    function getPdfLink(status) {
        try {
            let PdfLink;

            switch (status) {
                case "Issued":
                    PdfLink = `http://${ip}${ApiAppConstants.getInvoiceDoc}/${doPk}`;
                    break;
                case "Reported":
                    PdfLink = `http://${ip}${ApiAppConstants.gatePass}?do_pk=${doPk}&type=inward`;

                    break;
                case "Unload":
                    PdfLink = `http://${ip}${ApiAppConstants.gatePass}?do_pk=${doPk}&type=outward`;
                    break;
                default:
                    PdfLink = `http://${ip}${ApiAppConstants.getInvoiceDoc}/${doPk}`;
            }

            return PdfLink;
        } catch (error) {
            console.error("Error converting status:", error);
            return "Unknown"; // or handle the error in a way that makes sense for your application
        }
    }


    const pdfUrl = getPdfLink(subtype);

    const handleAction = async () => {

        const data = await NetworkRepository.loadingInstructionUpdate2({
            remaining_balance: balance.balance.toString() === "balance",
            credit: true,
            orderId: ids,
            qty: quantity,
            status: 'Approved',
            gstin_other_tax: '0',
            sellerId: selectedUser.id
        });

        console.log('dio', data)

        if (data) {
            console.log('issue do', `http://${ip}/${ApiAppConstants.getDoDoc}${data.id}`)

            printDoOpen(`http://${ip}/${ApiAppConstants.getDoDoc}${data.id}`)

        }

    }


    console.log('balance?.balance', balance)

    console.log('statusType', statusType, qcStatus, subtype)

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isMailDialogOpen, setMailDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setTaxDialog(null);
        dispatch(selectState(!currentState));
        setMailDialogOpen(false);
        setPdfData(null)
    };

    const handleEmailSend = async () => {
        console.log('mailDoInvoice', doPk)
        try {
            await NetworkRepository.mailDoInvoice(true, doPk)
            showSnackbar('Mail sent successfully', 'success');
        } catch (error) {
            console.error("Error converting status:", error);
        } finally {
            setMailDialogOpen(false)
        }
    };

    const handlePdf = async (url) => {
        try {
            const apiResponse = await NetworkRepository.getPdf(url);
            if (isMounted.current) {
                setPdfData(apiResponse);
            }
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };



    useEffect(() => {
        const pdfContainer = pdfContainerRef.current;

        if (pdfData && pdfContainer) {
            const dataUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));

            const pdfEmbed = document.createElement('iframe');
            pdfEmbed.setAttribute('width', '100%');
            pdfEmbed.setAttribute('height', '600px');
            pdfEmbed.setAttribute('type', 'application/pdf');
            pdfEmbed.setAttribute('src', dataUrl);

            pdfContainer.innerHTML = '';
            pdfContainer.appendChild(pdfEmbed);
        }

    }, [pdfUrl, pdfData, isMounted]);



    console.log('pdfData', pdfData)

    const pdfPopUp = (dialogOpen) => (

        (
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth
                maxWidth="md"
            >
                <DialogTitle >
                    <Stack sx={{ height: '10px' }} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">View PDF</Typography>
                        <Box display="flex" justifyContent="space-between" sx={{ gap: 1, height: '30px' }} >
                            <HoverExpandButton onClick={handleDialogClose} width='90px' color={theme.palette.error.main}>
                                <Iconify icon="basil:cancel-solid" />
                                <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>Close</Typography>
                            </HoverExpandButton>
                        </Box>
                    </Stack>
                </DialogTitle>
                <Paper>
                    {pdfData ? <div ref={pdfContainerRef} /> : <SkeletonLoader marginTop='10px' />}
                </Paper>
            </Dialog>
        )
    )

    const printOpen = () => {
        setDialogOpen(true)
        if (subtype === 'Issued' || subtype === 'Reported' || subtype === 'Unload') {
            handlePdf(pdfUrl);
        }
    }

    const printDoOpen = (url) => {
        setDialogOpen(true)
        handlePdf(url);
    }

    console.log('subtype', subtype)

    return (
        <>
            <TableRow
                onMouseEnter={() => handleToggle(true)}
                onMouseLeave={() => handleToggle(false)}
                style={{ backgroundColor: loadingInstructions?.status === 'Cancel' ? theme.palette.error.cancelled : 'inherit' }}

                hover tabIndex={-1} role="checkbox">
                <TableCell
                    onClick={() => handleOpenDetails(lrId)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderRadius = loadingInstructions?.status === 'Cancel' ? '0px' : '8px';
                        e.currentTarget.style.boxShadow = loadingInstructions?.status === 'Cancel' ? '0' : '5px 5px 10px rgba(77, 182, 172,0.9)';
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
                <TableCell>
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
                {loadingInstructions?.status !== 'Cancel' ? (<TableCell
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.grey[200];
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.common.white;
                    }}
                    align="right"
                    style={{ position: 'sticky', right: 0, zIndex: 0, backgroundColor: loadingInstructions?.status === 'Cancel' ? theme.palette.error.cancelled : theme.palette.common.white }} >
                    {loadingInstructions?.status !== 'Cancel' && (

                        <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }}  >
                            {
                                type === 'invoice' && (
                                    <HoverExpandButton onClick={printOpen} width='100px' color={theme.palette.success.main} >
                                        <Iconify icon="lets-icons:print" />
                                        <Box sx={{ fontWeight: 'bold' }}> Print</Box>
                                    </HoverExpandButton>
                                )
                            }
                            {type === 'invoice' && (
                                <HoverExpandButton onClick={() => setMailDialogOpen(true)} width='100px' color={theme.palette.info.main}>
                                    <Iconify icon="fluent:mail-24-filled" />
                                    <Box sx={{ fontWeight: 'bold' }}> Mail</Box>
                                </HoverExpandButton>
                            )
                            }
                            {
                                type === 'loadingsInstruction' && subtype !== 'Booked' && (
                                    <HoverExpandButton onClick={() => handleOpen(qcStatus === 'Done' ? 'Are you sure you want to Issue DO?' : 'Are you sure you want to Approve?', qcStatus === 'Done' ? 'issued' : 'Booked')} width='110px' color={theme.palette.success.main}>
                                        <Iconify icon={qcStatus === 'Done' ? "material-symbols:order-approve-rounded" : "pajamas:issue-closed"} />
                                        <Box sx={{ fontWeight: 'bold' }}>{qcStatus === 'Done' ? 'Issue DO' : 'Approve'}</Box>
                                    </HoverExpandButton>
                                )
                            }

                            {
                                type === 'loadingsInstruction' && subtype === 'Booked' && qcStatus === 'Done' && (
                                    <HoverExpandButton onClick={() => handleOpen('Are you sure you want to Issue DO?', 'Issued')} width='110px' color={theme.palette.success.main}>
                                        <Iconify icon="material-symbols:order-approve-rounded" />
                                        <Box sx={{ fontWeight: 'bold' }}>Issue DO</Box>
                                    </HoverExpandButton>
                                )
                            }
                            {
                                type === 'loadingsInstruction' && (
                                    <HoverExpandButton onClick={() => handleOpen('Are you sure you want to Reject?', 'Rejected')} width='100px' color={theme.palette.error.main}>
                                        <Iconify icon="basil:cancel-solid" />
                                        <Box sx={{ fontWeight: 'bold' }}> Reject</Box>
                                    </HoverExpandButton>
                                )
                            }
                        </Box>

                    )
                    }

                </TableCell>) : (
                    <TableCell
                        style={{ position: 'sticky', right: 0, color: theme.palette.error.cancelled }}
                    >
                        <Label color={theme.palette.error.main} variant='filled'>
                            {loadingInstructions?.status === "cancel" ? loadingInstructions?.status : 'Canceled'}
                        </Label>
                    </TableCell>
                )}
            </TableRow>

            <AlertDialog
                content={content}
                isDialogOpen={open}
                runConfirm={qcStatus !== 'Done'}
                handleConfirm={() => handleConfirm(statusType)}
                handleClose={handleClose} />

            <Dialog open={openTaxDialog} onClose={handleClose}>
                <DialogTitle>
                    <Stack direction="row">
                        <Typography sx={{ mr: 2 }}>Payment pending</Typography>
                        <Iconify icon="noto:warning" sx={{ height: 18, width: 18, mt: 0.4 }} />

                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Box mb={4} ml={1}>
                        <Label color={theme.palette.error.main}>{balance?.error}</Label>
                    </Box>
                    <DialogContentText>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order No</TableCell>
                                        <TableCell>Vehicle No</TableCell>
                                        <TableCell>Balance Rs</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {ids.join(', ')}
                                        </TableCell>
                                        <TableCell>

                                            <Typography key={loadingInstructions?.veicle_num}>{loadingInstructions?.veicle_num}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            ₹ {fCurrency(balance?.balance)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </DialogContentText>



                </DialogContent>
                <DialogActions>
                    <LoadingButton loading={loading} onClick={handleAction}>{balance?.balance === 'balance' ? 'OK' : 'CREDIT SALE'}</LoadingButton>
                    <LoadingButton sx={{ color: 'error.main' }} onClick={handleClose}>CANCEL</LoadingButton>
                </DialogActions>
            </Dialog>


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
            <AlertDialog
                content='Are sure you want send mail'
                isDialogOpen={isMailDialogOpen}
                handleConfirm={handleEmailSend}
                handleClose={handleDialogClose} />
            {pdfPopUp(isDialogOpen)}
        </>
    );
}

DispatchTableRow.propTypes = {
    type: PropTypes.string,
    subtype: PropTypes.string,
    orderNo: PropTypes.string,
    lrNum: PropTypes.string,
    doPk: PropTypes.string,
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
    loadingInstructions: PropTypes.any,
};
