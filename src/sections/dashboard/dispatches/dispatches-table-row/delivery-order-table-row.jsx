import { Alert, Avatar, Box, Dialog, DialogTitle, Paper, Snackbar, Stack, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';

import { useTheme } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiAppConstants, ip } from 'src/app-utils/api-constants';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import AlertDialog from 'src/components/dialogs/action-dialog';
import Iconify from 'src/components/iconify';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';



export default function DoOrderTableRow({
    doNo,
    doId,
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
    const pdfContainerRef = useRef();
    const [pdfData, setPdfData] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const isMounted = useRef(true); // Add this line


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


    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const [expanded, setExpanded] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isMailDialogOpen, setMailDialogOpen] = useState(false);

    console.log('doNo', doId)

    const pdfUrl = `http://${ip}/${ApiAppConstants.getDoDoc}${doId}`;


    const termalPdfUrl = `http://${ip}/${ApiAppConstants.thermalDo}${doId}`;

    const handleDialogClose = () => {
        setDialogOpen(false);
        setMailDialogOpen(false);
        setPdfData(null)
    };

    const handleEmailSend = async () => {
        console.log('mailDoInvoice', doId)
        try {
            await NetworkRepository.mailDoInvoice(false, doId)
            showSnackbar('Mail sent successfully', 'success');
        } catch (error) {
            console.error("Error converting status:", error);
        } finally {
            setMailDialogOpen(false)
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



    const handleToggle = (val) => {
        setExpanded(val);
    };




    const handleOpenDetails = (orderSelected) => {
        navigate(`/home/loading-instruction-details/${orderSelected}`); // Use navigate to go to the details page
    };


    const printOpen = (url) => {
        setDialogOpen(true)

        handlePdf(url);

    }

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

                        <HoverExpandButton onClick={() => printOpen(pdfUrl)} width='100px' color={theme.palette.success.main}>
                            <Iconify icon="lets-icons:print" />
                            <Box sx={{ fontWeight: 'bold' }}> Print </Box>
                        </HoverExpandButton>

                        <HoverExpandButton onClick={() => setMailDialogOpen(true)} width='100px' color={theme.palette.info.main}>
                            <Iconify icon="fluent:mail-24-filled" />
                            <Box sx={{ fontWeight: 'bold' }}> Mail </Box>
                        </HoverExpandButton>



                        <HoverExpandButton onClick={() => printOpen(termalPdfUrl)} width='125px' color={theme.palette.info.dark}>
                            <Iconify icon="solar:printer-minimalistic-bold-duotone" />
                            <Box sx={{ fontWeight: 'bold' }}> thermal DO </Box>
                        </HoverExpandButton>

                        <HoverExpandButton onClick={handleOpenMenu} width='100px' color={theme.palette.error.main}>
                            <Iconify icon="basil:cancel-solid" />
                            <Box sx={{ fontWeight: 'bold' }}> Cancel </Box>
                        </HoverExpandButton>

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

DoOrderTableRow.propTypes = {
    doNo: PropTypes.string,
    doId: PropTypes.string,
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
