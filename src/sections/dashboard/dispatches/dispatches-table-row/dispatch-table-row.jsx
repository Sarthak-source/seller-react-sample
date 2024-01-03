import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@emotion/react';
import { Alert, Avatar, Box, Dialog, DialogTitle, Paper, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { ApiAppConstants, ip } from 'src/app-utils/api-constants';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import AlertDialog from 'src/components/dialogs/action-dialog';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
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
}) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const theme = useTheme();
    const pdfContainerRef = useRef();
    const isMounted = useRef(true); // Add this line



    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
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



    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isMailDialogOpen, setMailDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setDialogOpen(false);
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
        }finally{
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
                <TableCell onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.palette.grey[200];
                }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.common.white;
                    }}
                    align="right" style={{ position: 'sticky', right: 0, zIndex: 0, backgroundColor: theme.palette.common.white }} >
                    <Box display="flex" justifyContent="space-between" sx={{ gap: 1 }} >
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
                            type === 'loadingsInstruction' && (
                                <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.success.main}>
                                    <Iconify icon="material-symbols:order-approve-rounded" />
                                    <Box sx={{ fontWeight: 'bold' }}> Approve</Box>
                                </HoverExpandButton>
                            )
                        }
                        {
                            type === 'loadingsInstruction' && (
                                <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.error.main}>
                                    <Iconify icon="basil:cancel-solid" />
                                    <Box sx={{ fontWeight: 'bold' }}> Reject</Box>
                                </HoverExpandButton>
                            )
                        }
                    </Box>
                </TableCell>
            </TableRow>


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
};
