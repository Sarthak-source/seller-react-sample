import { Box, Button, Card, Container, Grid, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ip } from '../../../../app-utils/api-constants';
import OrderCard from './components/order-card';


export default function OrderDetails() {
    const { data } = useParams();
    const [tab, setTab] = useState(0);
    console.log(data)
    const selectedOrder = useSelector((state) => state.orders.selectedOrder);


    const url = `http://${ip}/order-dashboard/order/${data}`;


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
            {tab === 0 && <Grid container>
                <Grid item xs={12} md={6} pr={5}>
                    <Box pb={2}>
                        <Card>
                            <Box pr={2} pl={2} pt={2} pb={2}>

                                <Box display="flex" justifyContent="space-between" pb={2}>
                                    <Typography variant="subtitle1">Loading Instruction</Typography>
                                    <Typography>40</Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" pb={2}>
                                    <Typography variant="subtitle1">Delivery Orders</Typography>
                                    <Typography>40</Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" >
                                    <Typography variant="subtitle1">Total Invoice</Typography>
                                    <Typography>20</Typography>
                                </Box>

                            </Box>
                        </Card>
                    </Box>
                    <Box pb={2}>
                    <OrderCard  data={selectedOrder} />
                    </Box>

                </Grid>
                <Grid item xs={12} md={6} pr={5}>

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
