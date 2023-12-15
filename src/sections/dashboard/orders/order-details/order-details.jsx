import { Box, Button, Card, Container, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { primary } from 'src/theme/palette';
import { ip } from '../../../../app-utils/api-constants';
import OrderCard from './components/order-card';



export default function OrderDetails() {
    const { data } = useParams();
    const [tab, setTab] = useState(0);
    const [orderSummary, setOrderSummary] = useState({});
    const [invoicesVehicles, setInvoicesVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const selectedOrder = useSelector((state) => state.orders.selectedOrder);

    useEffect(() => {
        const fetchOrderData = async (orderID) => {
            try {
                setLoading(true);
                const orderData = await NetworkRepository.orderSummary(orderID);
                setOrderSummary(orderData);
                const invoicesVehicleData = await NetworkRepository.invoicesVehicleDetails(orderID);

                setInvoicesVehicles(invoicesVehicleData.results);
            } catch (error) {
                console.error('Error fetching Order data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderData(data);
    }, [data]);

    console.log(orderSummary)


    const url = `http://${ip}/order-dashboard/order/${data}`;

    if (loading) {
        return (
            <Box marginTop="-20%">
                <SkeletonLoader />
            </Box>
        );
    }


    return (
        <Container maxWidth="xl" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            <Typography variant="h4">Order Summary</Typography>

            <Tabs
                value={tab}
                onChange={(event, newValue) => setTab(newValue)}
                textColor="primary"
                indicatorColor="primary"
                style={{ marginBottom: '2%', display: 'flex', justifyContent: 'flex-start' }}
            >
                <Tab label="Summary" style={{ marginLeft: '-18px' }} />
                <Tab label="Dashboard" />
            </Tabs>
            {tab === 0 &&

                <Grid container spacing={5}>
                    <Grid item xs={12} md={6} >
                        <Box pb={4}>
                            <OrderCard data={selectedOrder} />
                        </Box>
                        <Box pb={4}>
                            <Card>
                                <Box pr={2} pl={2} pt={2} pb={2}>

                                    <Box display="flex" justifyContent="space-between" pb={1}>
                                        <Typography variant="subtitle1">Loading Instruction</Typography>
                                        <Typography>{orderSummary.orderSeller.li_count}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box display="flex" justifyContent="space-between" pb={1} pt={1}>
                                        <Typography variant="subtitle1">Delivery Orders</Typography>
                                        <Typography>{orderSummary.orderSeller.do_count}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box display="flex" justifyContent="space-between" pt={1}>
                                        <Typography variant="subtitle1">Total Invoice</Typography>
                                        <Typography>{orderSummary.orderSeller.inv_count}</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>

                        <Box >
                            {invoicesVehicles && invoicesVehicles.length > 0 ? (
                                <Card>
                                    <Typography variant="h6" color="primary.main" sx={{ p: 2 }}>
                                        Invoice vehicles
                                    </Typography>
                                    <TableContainer>
                                        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Invoice Date
                                                    </TableCell>
                                                    <TableCell>
                                                        Vehicle No
                                                    </TableCell>
                                                    <TableCell>
                                                        Quantity
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {invoicesVehicles.map((row, index) => (
                                                    <TableRow key={index} style={{ height: '50px' }}>
                                                        <TableCell>
                                                            {format(parseISO(row.invoice_date), 'dd MMM yy h:mm a')}
                                                        </TableCell>
                                                        <TableCell>{row.vehicle_num}</TableCell>
                                                        <TableCell>
                                                            {`${row.total_qty} ${row.loading_instruction[0].product.product_type}`}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>) : (

                                <Label
                                    color={primary.main}
                                    sx={{
                                        position: 'absolute',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    No invoice vehicles
                                </Label>

                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Card>
                            <Box p={2}>
                                <TextField
                                    // controller={poNumber}
                                    variant="outlined"
                                    margin="dense"
                                    label="PO Number"
                                    fullWidth
                                />
                                <Box style={{ height: 20 }} />
                                <TextField
                                    // controller={invoiceOrderPrefix}
                                    variant="outlined"
                                    margin="dense"
                                    label="Invoice order prefix"
                                    fullWidth
                                />
                                <Box style={{ height: 20 }} />
                                <TextField
                                    // controller={lutNo}
                                    variant="outlined"
                                    margin="dense"
                                    label="Lut No."
                                    fullWidth
                                />
                                <Box style={{ height: 20 }} />
                                <TextField
                                    // controller={remark}
                                    variant="outlined"
                                    margin="dense"
                                    label="Remark"
                                    fullWidth
                                />
                                <Box style={{ height: 20 }} />
                                <TextField
                                    // controller={shippingFromController}
                                    variant="outlined"
                                    margin="dense"
                                    label='Shipping From'
                                    fullWidth
                                />
                                <Box style={{ height: 20 }} />
                                <TextField
                                    // controller={transporterIdController}
                                    variant="outlined"
                                    margin="dense"
                                    label='Transporter Id'
                                    fullWidth
                                />
                                <Box style={{ height: 20 }} />
                                <Button variant="contained" fullWidth style={{ height: '40px' }}>
                                    Update
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            }
            {tab === 1 &&
                <iframe
                    src={url}
                    title="Order Dashboard"
                    style={{ width: '100%', height: '70vh', border: 'none' }}
                />
            }
        </Container>
    );
}
