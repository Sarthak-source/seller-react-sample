import { Box, Container, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import OrderCard from '../order-details/components/order-card';
import AddVehicleForm from './components/vehicle-add-form';



export default function AddVehicle() {
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


    if (loading) {
        return (
            <Box marginTop="-20%">
                <SkeletonLoader />
            </Box>
        );
    }


    return (
        <Container maxWidth="xl" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            <Typography variant="h4" mb='2%'>Add Vehicle</Typography>

           

                <Grid container spacing={5} >
                    <Grid item xs={12} md={6} >
                        <Box pb={4}>
                            <OrderCard data={selectedOrder} />
                        </Box>
                       
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <AddVehicleForm orderSummary={orderSummary} />
                    </Grid>
                </Grid>
        </Container>
    );
}
