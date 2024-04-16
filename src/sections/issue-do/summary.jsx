import { Button, Card, CardContent, Container, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Label from 'src/components/label';
import { primary } from 'src/theme/palette';


function SummaryScreen() {
    const [buttonEnable, setButtonEnable] = useState(true);
    const storeSummary = useSelector((state) => state.storeSummaryState.selectedStoreSummary); // Assuming you have a slice of state named 'storeSummaryState' with 'selectedStoreSummary' data

    const handleGenerateInvoice = async () => {
        setButtonEnable(false);
        // Logic for generating invoice
        try {
            // Your async logic here
        } catch (error) {
            console.error(error);
        } finally {
            setButtonEnable(true);
        }
    };

    return (
        <Container maxWidth="xl" style={{ paddingLeft: '30px', paddingRight: '30px', marginTop: 15 }}>
            <Typography variant="h4" gutterBottom>
                    Summary
                </Typography>
            <Grid container spacing={2}>
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
                        <Divider />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" my={1} mx={1}>
                            <Typography variant="body2">Mill :</Typography>
                            <Label color={primary.main} sx={{ fontSize: '13px', fontWeight: 'bold' }} > {storeSummary.data.mill?.name} </Label>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
                {/* Render image from base64 string */}
                {storeSummary.storeData.image && (
                    <img src={`data:image/png;base64,${storeSummary.storeData.image}`} alt="" />
                )}
            </Grid>

            <Grid item xs={12}>
                {/* Render generate invoice button */}
                <Button onClick={handleGenerateInvoice} variant="contained" disabled={!buttonEnable}>
                    Generate Invoice
                </Button>
            </Grid>
        </Grid>
</Container>
        
    );
}

export default SummaryScreen;
