import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, Container, Dialog, DialogTitle, Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { primary } from 'src/theme/palette';


function SummaryScreen() {
    const [buttonEnable, setButtonEnable] = useState(true);
    const storeSummary = useSelector((state) => state.storeSummaryState.selectedStoreSummary);
    const fromVehicleInward = useSelector((state) => state.storeSummaryState.fromVehicleInward); // Assuming you have a slice of state named 'storeSummaryState' with 'selectedStoreSummary' data
    const pdfContainerRef = useRef();
    const isMounted = useRef(true); // Add this line
    const theme = useTheme();

    const [pdfUrl, setPdfUrl] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);

    console.log('fromVehicleInward', fromVehicleInward)

    const handleDialogClose = () => {
        setDialogOpen(false);

        setPdfData(null)
    };

    const handleGenerateInvoice = async () => {
        console.log('hsdhsakskaksak', storeSummary, {
            tareWright: storeSummary.storeData.tareWeight.toString(),
            storePK: storeSummary.storeData.millId,
            grossWeight: storeSummary.storeData.grossWeight,
            product: storeSummary.data.product,
            invoiceQty: storeSummary.data.invoiceQty,
            quantity: storeSummary.data.quantity,
            vehicle: storeSummary.data.vehicle_num.toString(),
            lot: storeSummary.storeData.lotID.toString(),
            weighBridge: storeSummary.storeData.image,
            lotwiseQuantity: storeSummary.storeData.lotwiseQ
        })

        console.log('generatedata')
        setButtonEnable(false);
        setDialogOpen(true)

        if (fromVehicleInward) {
            try {
                const inwardData = await NetworkRepository.inwardDispatchApi({
                    tareWright: storeSummary.storeData.tareWeight.toString(),
                    storePK: storeSummary.storeData.millId,
                    grossWeight: storeSummary.storeData.grossWeight,
                    product: storeSummary.data.product,
                    invoiceQty: storeSummary.data.invoiceQty,
                    quantity: storeSummary.data.quantity,
                    vehicle: storeSummary.data.vehicle_num.toString(),
                    lot: storeSummary.storeData.lotID.toString(),
                    weighBridge: storeSummary.storeData.image,
                    lotwiseQuantity: storeSummary.storeData.lotwiseQ
                });
            } catch (e) {
                console.log(e.toString());
            } finally {
                setButtonEnable(true);
            }
        } else {
            try {
                let sendData = {
                    tareWright: storeSummary.storeData.tareWeight.toString(),
                    lotwiseQuantity: storeSummary.storeData.lotwiseQ,
                    storePK: storeSummary.storeData.millId,
                    grossWeight: storeSummary.storeData.grossWeight,
                    doPK: storeSummary.data.id,
                    doTypePK: storeSummary.data.do_type.id,
                    image: storeSummary.storeData.image
                };
                if (storeSummary.storeData.image != null) {
                    if (storeSummary.sealRemark != null || storeSummary.sealNumber != null) {
                        sendData = { ...sendData, sealRemark: storeSummary.sealRemark, sealNumber: storeSummary.sealNumber };
                    }
                }
                await NetworkRepository.sendStoreHouseData(sendData);
            } catch (e) {
                console.log(e.toString());
            } finally {
                setButtonEnable(true);
            }
        }


        // Logic for generating invoice
        try {
            // Your async logic here
        } catch (error) {
            console.error(error);
        } finally {
            setButtonEnable(true);
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

    const [pdfData, setPdfData] = useState(null);


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
        handlePdf(pdfUrl);

    }

    const printDoOpen = (url) => {
        setDialogOpen(true)
        handlePdf(url);
    }

    return (
        <Container maxWidth="xl" style={{ paddingLeft: '30px', paddingRight: '30px', marginTop: 15 }}>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4">Summary</Typography>
                <LoadingButton variant="contained" loading={!buttonEnable} startIcon={<Iconify icon="line-md:cloud-print-loop" />} onClick={handleGenerateInvoice}>
                    Generate Invoice
                </LoadingButton>
            </Stack>



            <Grid container spacing={5}>
                <>
                    <Grid item xs={12} md={6}>

                        {/* Render summary information */}
                        <Card>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} mx={1}>
                                    <Typography variant="body2">Vehicle No :</Typography>
                                    <Label color={primary.main} sx={{ fontSize: '13px', fontWeight: 'bold' }} > {storeSummary.data.vehicle_num} </Label>
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between" alignItems="center" my={1} mx={1}>
                                    <Typography variant="body2">Mill :</Typography>
                                    <Label color={primary.main} sx={{ fontSize: '13px', fontWeight: 'bold' }} > {storeSummary.data.mill?.name} </Label>
                                </Stack>
                                {/* <Divider /> */}
                                {/* <Stack direction="row" justifyContent="space-between" alignItems="center" my={1} mx={1}>
                                    <Typography variant="body2">Mill :</Typography>
                                    <Label color={primary.main} sx={{ fontSize: '13px', fontWeight: 'bold' }} > {storeSummary.data.mill?.name} </Label>
                                </Stack> */}
                            </CardContent>
                        </Card>

                        <Typography variant="h4" gutterBottom>
                            Selected Lots
                        </Typography>
                        {/* Render selected lots */}
                        <TableContainer component={Card}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Store</TableCell>
                                        <TableCell>Lot</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {storeSummary.lot.map((lot, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{lot.storeName}</TableCell>
                                            <TableCell>{lot.name}</TableCell>
                                            <TableCell>{lot.product_name}</TableCell>
                                            <TableCell>{lot.qty} {storeSummary.qtyUnit}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>




                </>

                <Grid item xs={15} md={6}>
                    {storeSummary.storeData.image && (
                        <Card sx={{ borderRadius: 4 }}>
                            <img
                                src={`data:image/png;base64,${storeSummary.storeData.image}`}
                                alt=""
                                style={{ width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }}
                            />
                        </Card>
                    )}
                </Grid>





            </Grid>

        </Container>

    );
}

export default SummaryScreen;
