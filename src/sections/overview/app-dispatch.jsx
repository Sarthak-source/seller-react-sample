import { Box, Button, Card, Grid, MobileStepper, Skeleton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import NetworkRepository from 'src/app-utils/network_repository';
import Chart from 'src/components/chart';
import { fShortenNumberIndian } from 'src/utils/format-number';
import AppWidgetSummary from './app-widget-summary';

const DispatchDashboardScreen = ({ productData }) => {
    const [currentMonth] = useState(new Date());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [monthWiseData, setMonthWiseData] = useState([]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const maxSteps = monthWiseData.length;

    useEffect(() => {
        const fetchProductDashboard = async () => {
            setLoading(true);
            try {
                const invoiceStats = await NetworkRepository.yearDispatches(productData);
                console.log('invoiceStats', invoiceStats);
                setMonthWiseData(invoiceStats.month_wise_data);
                setData(invoiceStats);
            } catch (error) {
                console.error('Error fetching invoice stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDashboard();
    }, [productData]);

    const receivedAmount = ((data?.month_wise_data[activeStep]?.received_amount ?? 0) / (data?.financial_year_data?.total_revenue ?? 0)) * 100 || 0;

    const dispatchedQty = ((data?.month_wise_data[activeStep]?.dispatched_qty ?? 0) / (data?.financial_year_data?.total_sale_qty ?? 0)) * 100 || 0;

    const dispatchedQtyOptions = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    show: false,
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                }
            }
        },
        colors: ['#00FF00'], // Green color
        labels: [],
    };

    const receivedAmountOptions = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    show: false,
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                }
            }
        },
        // Blue color
        labels: [],
    };

    return (
        <>
            <Grid item mt={1}>
                <Typography variant="h6" color="secondary">Current Financial year</Typography>

                <Grid container spacing={1} mt={1}>
                    <Grid item xs={6} sm={3} md={3}>
                        {!loading ? (
                            <AppWidgetSummary
                                title="TOTAL REVENUE"
                                total={fShortenNumberIndian(data?.financial_year_data?.total_revenue)}
                                color="success"
                                icon={<img src="/assets/dashboard/dispatches-quantity.svg" alt="" />}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />
                        )}
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        {!loading ? (
                            <AppWidgetSummary
                                title="TOTAL SALE QTY"
                                total={data?.financial_year_data?.total_sale_qty != null ? data?.financial_year_data?.total_sale_qty : '0'}
                                color="info"
                                icon={<img src="/assets/dashboard/dispatches-on-truck.svg" alt="" />}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />
                        )}
                    </Grid>

                    <Grid item xs={6} sm={3} md={3}>
                        {!loading ? (
                            <AppWidgetSummary
                                title="PENDING ORDERS"
                                total={data?.financial_year_data?.pending_orders != null ? data?.financial_year_data?.pending_orders : '0'}
                                color="warning"
                                icon={<img src="/assets/dashboard/sales-report.svg" alt="" />}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />
                        )}
                    </Grid>

                    <Grid item xs={6} sm={3} md={3}>
                        {!loading ? (
                            <AppWidgetSummary
                                title="TOTAL DISPATCHES"
                                total={data?.financial_year_data?.total_dispatches != null ? data?.financial_year_data?.total_dispatches : '0'}
                                color="warning"
                                icon={<img src="/assets/dashboard/sales-report.svg" alt="" />}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />
                        )}
                    </Grid>
                </Grid>

                <MobileStepper
                    variant='text'
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button onClick={handleNext} disabled={activeStep === maxSteps - 1 || activeStep >= monthWiseData.length - 1}>
                            Next ({monthWiseData[activeStep + 1]?.month_year ?? 'no data'})
                        </Button>
                    }
                    backButton={
                        <Button onClick={handleBack} disabled={activeStep === 0}>
                            Back ({monthWiseData[activeStep - 1]?.month_year ?? 'no data'})
                        </Button>
                    }
                />

                <Grid item mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={6} lg={5}>
                            <Card variant="outlined">
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                                    <Grid item xs={6} md={5.5} lg={8}>
                                        <Chart
                                            options={dispatchedQtyOptions}
                                            series={[dispatchedQty]}
                                            type="radialBar"
                                            height={250}
                                        />
                                        <Typography variant="subtitle2" sx={{ mx: 2 }}>
                                            Dispatched Qty: {dispatchedQty.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={4} lg={8}>
                                        <Chart
                                            options={receivedAmountOptions}
                                            series={[receivedAmount]}
                                            type="radialBar"
                                            height={250}
                                        />
                                        <Typography variant="subtitle2" sx={{ mx: 2 }}>
                                            Received Amount: {fShortenNumberIndian(receivedAmount)}
                                        </Typography>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={7}>
                            <Card>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Card>
                                            <Box sx={{ padding: '16px' }}>
                                                <Typography sx={{ color: 'grey', fontSize: '14px', fontWeight: 500 }}>
                                                    TOTAL ORDERS
                                                </Typography>
                                                <Typography color="secondary" sx={{ fontSize: '26px', fontWeight: 600, marginTop: '8px' }}>
                                                    {monthWiseData[activeStep]?.total_orders != null ? monthWiseData[activeStep]?.total_orders.toString() : '0'}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Card>
                                            <Box sx={{ padding: '16px' }}>
                                                <Typography sx={{ color: 'grey', fontSize: '14px', fontWeight: 500 }}>
                                                    TODAY ORDERS
                                                </Typography>
                                                <Typography color="secondary" sx={{ fontSize: '26px', fontWeight: 600, marginTop: '8px' }}>
                                                    {monthWiseData[activeStep]?.today_orders != null ? monthWiseData[activeStep]?.today_orders.toString() : '0'}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Card>
                                            <Box sx={{ padding: '16px' }}>
                                                <Typography sx={{ color: 'grey', fontSize: '14px', fontWeight: 500 }}>
                                                    BALANCE QTY
                                                </Typography>
                                                <Typography color="secondary" sx={{ fontSize: '26px', fontWeight: 600, marginTop: '8px' }}>
                                                    {monthWiseData[activeStep]?.balance_qty != null ? monthWiseData[activeStep]?.balance_qty.toString() : '0'}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Card>
                                            <Box sx={{ padding: '16px' }}>
                                                <Typography sx={{ color: 'grey', fontSize: '14px', fontWeight: 500 }}>
                                                    BALANCE AMOUNT
                                                </Typography>
                                                <Typography color="secondary" sx={{ fontSize: '26px', fontWeight: 600, marginTop: '8px' }}>
                                                    {Number.isNaN(monthWiseData[activeStep]?.balance_qty) ? '0' : fShortenNumberIndian(monthWiseData[activeStep]?.balance_amount)}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Card>
                                            <Box sx={{ padding: '16px' }}>
                                                <Typography sx={{ color: 'grey', fontSize: '14px', fontWeight: 500 }}>
                                                    TOTAL DISPATCHES
                                                </Typography>
                                                <Typography color="secondary" sx={{ fontSize: '26px', fontWeight: 600, marginTop: '8px' }}>
                                                    {monthWiseData[activeStep]?.total_dispatches != null ? monthWiseData[activeStep]?.total_dispatches.toString() : '0'}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Card>
                                            <Box sx={{ padding: '16px' }}>
                                                <Typography sx={{ color: 'grey', fontSize: '14px', fontWeight: 500 }}>
                                                    TODAY DISPATCHES
                                                </Typography>
                                                <Typography color="secondary" sx={{ fontSize: '26px', fontWeight: 600, marginTop: '8px' }}>
                                                    {data?.financial_year_data?.today_dispatches != null ? data?.financial_year_data?.today_dispatches.toString() : '0'}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

DispatchDashboardScreen.propTypes = {
    productData: PropTypes.any,
};

export default DispatchDashboardScreen;
