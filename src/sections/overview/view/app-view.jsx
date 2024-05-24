
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import NetworkRepository from 'src/app-utils/network_repository';

import { Button, Card, CardHeader, Dialog, MenuItem, Select, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tabs } from '@mui/material';
import { format, subDays } from 'date-fns';
import { enGB } from 'date-fns/locale';


import { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { useSelector } from 'react-redux';
import { fShortenNumberIndian } from 'src/utils/format-number';
import AppCurrentVisits from '../app-current-visits';
import AppNewsUpdate from '../app-news-update';

import DispatchDashboardScreen from '../app-dispatch';
import LineChart from '../app-line-chart';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------



export default function AppView() {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loadingProduct, setLoadingProduct] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [value, setValue] = useState(0);
  const [selectedRange, setSelectedRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    key: 'selection'
  });
  const [data, setData] = useState({});
  const [recentInvoiceData, setRecentInvoiceDataData] = useState({});
  const [recentProductDashboard, setRecentProductDashboard] = useState({});

  const handleSelectChange = (event) => {
    setLoading(true);
    setSelectedOption(event.target.value);
  };

  const handleProductChange = (event) => {
    setLoading(true);
    setSelectedProduct(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateRangeChange = (ranges) => {
    setLoading(true);
    setSelectedRange(ranges.selection);
  };

  useEffect(() => {
    const fetchInvoiceStatsForDate = async (date) => {
      setLoading(true);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const invoiceStats = await NetworkRepository.getInvoiceStatsForDate(formattedDate, selectedOption.toString()??'',selectedProduct.toString() ?? '0');
        setData(invoiceStats);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInvoiceStatsForRange = async (startDate, endDate) => {
      setLoading(true);
      try {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        const invoiceStats = await NetworkRepository.getInvoiceStats(formattedStartDate, formattedEndDate, selectedOption.toString()??'',selectedProduct.toString() ?? '0');
        setData(invoiceStats);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedRange.startDate === selectedRange.endDate) {
      fetchInvoiceStatsForDate(selectedRange.startDate);
    } else {
      fetchInvoiceStatsForRange(selectedRange.startDate, selectedRange.endDate);
    }
  }, [selectedRange, selectedOption,selectedProduct]);
  

  useEffect(() => {
    const fetchLatestInvoice = async () => {
      setLoadingProduct(true);

      try {
        const formattedStartDate = format(selectedRange.startDate, "yyyy-MM-dd");
        const formattedEndDate = format(selectedRange.endDate, "yyyy-MM-dd");
        const invoiceStats = await NetworkRepository.getRecentInvoices(selectedOption.toString(), formattedStartDate, formattedEndDate, selectedProduct.toString() ?? '0',selectedUser.id);
        setRecentInvoiceDataData(invoiceStats);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchLatestInvoice();

  }, [selectedOption, selectedRange, selectedProduct,selectedUser]);


  useEffect(() => {
    const fetchProductDashboard = async () => {
      setLoading(true);
      try {
        const invoiceStats = await NetworkRepository.getProductDashboard(selectedOption, format(selectedRange.startDate, "yyyy"), format(selectedRange.startDate, "MM"), selectedProduct.toString() ?? '0');
        setRecentProductDashboard(invoiceStats);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedOption !== '') {
      fetchProductDashboard();
    }

  }, [selectedProduct, selectedRange, selectedOption]);



  

  console.log('datalalal', data);

  console.log('recentInvoiceData', recentInvoiceData)

  console.log('recentProductDashboard', recentProductDashboard);

  console.log('selectedProduct', selectedProduct)

  const seriesData = recentInvoiceData?.products_data?.map(item => ({
    label: item.product__code,
    value: item.total_quantity // Assuming you want to use total_quantity as the value
  }));


 

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
        <Typography variant="h4">
          Hi, {selectedUser.name && selectedUser.name.charAt(0).toUpperCase() + selectedUser.name.slice(1)} 👋
        </Typography>
        <Stack direction="row" sx={{ transform: 'scale(0.8)', mb: 1, mr: value !== 2 ? -9.5 : 0 }} >
          <Stack >
            <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
              Select mill
            </Typography>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              displayEmpty
              style={{ width: '250px' }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="" disabled>
                Select a mill
              </MenuItem>
              {selectedUser.mills.map((mill) => (
                <MenuItem key={mill.id} value={mill.id}>
                  {mill.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {value !== 2 ? (<>
            <Stack pl={1}>
              {selectedOption && (
                <>
                  <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
                    Select product
                  </Typography>
                  <Select
                    value={selectedProduct}
                    onChange={handleProductChange}
                    displayEmpty
                    style={{ width: '250px' }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="" >
                      All
                    </MenuItem>
                    {selectedUser.mills
                      .find((mill) => mill.id === selectedOption)
                      ?.products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.product_type.product_type} {`(${product.code === '' ? 'none' : product.code})`}

                        </MenuItem>
                      ))}
                  </Select>
                </>

              )}


            </Stack>
            <Stack pl={1}>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
                Select date
              </Typography>
              <Button sx={{ minWidth: 200, minHeight: 53 }} variant="outlined" onClick={() => setOpen(true)}>
                {format(selectedRange.startDate, 'MMM/dd/yyyy')} - {format(selectedRange.endDate, 'MMM/dd/yyyy')}
              </Button>
            </Stack>

          </>) : (
            <></>
          )}


        </Stack>
      </Stack>

      <Tabs value={value} onChange={handleChange} textColor="primary"
        indicatorColor="primary"

        style={{
          marginBottom: '2px',
          marginTop: -45,
          display: 'flex',
          width: "100%",
          justifyContent: 'flex-start',

          zIndex: -2,
          backgroundColor: '#f9fafb',
        }}
        sx={{ mb: -5 }}
      >
        <Tab label="Home" style={{ marginLeft: '-18px' }} />
        <Tab label="Product" />
        <Tab label="Dispatch" />

      </Tabs>


      {value === 0 && (
        <Grid container spacing={5} mt={0.2}>

          <Grid xs={12} sm={6} md={4} >
            {!loading ? (
              <AppWidgetSummary
                title="Total Dispatch quantity"
                total={data.totals?.total_invoice_qty}
                unit='QTL'
                color="success"
                icon={
                  <img src="/assets/dashboard/dispatches-quantity.svg" alt="" />
                }
              />
            ) : (
              <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />

            )}
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            {!loading ? (
              <AppWidgetSummary
                title="Dispatches"
                total={data.totals?.total_count}
                color="info"
                icon={<img src="/assets/dashboard/dispatches-on-truck.svg" alt="" />}
              />) : (<Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />)}
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            {!loading ? (<AppWidgetSummary
              title="Total Sale amount"
              useShotHand
              total={data.totals?.total_invoice_amount}
              color="warning"
              icon={<img src="/assets/dashboard/sales-report.svg" alt="" />}
            />) : (<Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} />)}
          </Grid>

          <Grid xs={12} md={8} lg={8}>
            {!loading ? (
              <AppWebsiteVisits
                title="Dispatches"
                subheader=""
                chart={{
                  labels: [
                    '2023',
                    '2024',
                    '2025',
                    '2026',
                    // Add more dates here as needed
                  ],
                  series: [
                    {
                      name: 'Quantity',
                      type: 'column',
                      fill: 'solid',

                    },
                    // Add more series as needed
                  ],
                  invoiceData: data.details // Assuming PromiseResult.details holds the invoice data
                }}
              />
            ) : (<Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />)}
          </Grid>

          <Grid xs={12} md={4} lg={4}>
            {!loading ? (
              data && data?.trader_data && (
                <AppNewsUpdate
                  title="Top 10 Traders"
                  list={data?.trader_data?.slice(0, 10).map((trader, index) => ({
                    id: trader?.invoice_count || '',
                    title: trader.phone_number || '',
                    description: trader?.trader || '',
                    image: `/assets/images/covers/cover_${index + 1}.jpg`,
                    postedAt: trader?.invoice_qty,
                  }))}
                />
              )
            ) : (
              <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />
            )}
          </Grid>

          <Grid xs={12} md={8} lg={8}>
            {!selectedValue ? (
              <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>
                <CardHeader title="Recent invoice" />

                <TableContainer sx={{ m: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Amounts</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentInvoiceData?.recent_invoices?.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.billing_address.name}</TableCell>
                          <TableCell>{row.shipping_address.name}</TableCell>
                          <TableCell>{row.total_qty}</TableCell>
                          <TableCell>{fShortenNumberIndian(row.total_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ) : (
              <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />
            )}
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            {!selectedValue ? (
              <AppCurrentVisits
                title="Product sales"
                chart={{
                  series: seriesData || [],
                }}
              />
            ) : (
              <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />
            )}
          </Grid>


          <Grid xs={12} lg={16}>
            <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>
              <CardHeader title="Top 5 Destinations" />
              <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>
                <TableContainer sx={{ m: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Serial #</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell># Dispatches	</TableCell>
                        <TableCell>Quantity</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentInvoiceData?.top_destinations?.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell>{(index + 1)}</TableCell>
                          <TableCell >{row.city}</TableCell>
                          <TableCell>{row.state}</TableCell>
                          <TableCell>{row.dispatch_count}</TableCell>
                          <TableCell>{row.total_qty}</TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Card>
          </Grid>
          {/* <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>


        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>



        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}

        </Grid>)}
      {value === 1 && (
        (
          <Grid container spacing={5} mt={0.2}>
            <Grid xs={12} md={8} lg={8}>
              <LineChart productData={recentProductDashboard} />
            </Grid>
            <Grid xs={12} md={4} lg={4}>
              <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>

                <Typography mx={2} my={2}>Storehouses</Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Storehouse</TableCell>
                        <TableCell>QTY</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentProductDashboard?.store_house_data ? (
                        recentProductDashboard.store_house_data.map((data_house, index) => (
                          <TableRow key={index}>
                            <TableCell>{data_house.store}</TableCell>
                            <TableCell >{data_house.qty < 0 ? 0 : data_house.qty}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2}>No data available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableCell>TOTAL STOCK</TableCell>
                      <TableCell color="secondary">
                        <Typography color="secondary" style={{ fontSize: '20px', fontWeight: 600 }}>
                          {recentProductDashboard.total_stock_qty < 0 ? 0 : recentProductDashboard.total_stock_qty}
                        </Typography>
                      </TableCell>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>

        )
      )}



      {value === 2 && (
        <DispatchDashboardScreen productData={selectedOption} />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} sx={{ width: '80%' }} PaperProps={{
        sx: {
          width: "80%",
          maxWidth: "80%!important",
        },
      }}>
        <>
          <DateRangePicker
            locale={enGB}
            onChange={handleDateRangeChange}
            showSelectionPreview
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={[selectedRange]}
            direction="horizontal"
            onClose={() => setOpen(false)}
          />
          {/* Button should have some content to display */}
          <Button onClick={() => setOpen(false)} color="primary" variant="contained">Submit</Button>
        </>
      </Dialog>


    </Container>
  );
}


