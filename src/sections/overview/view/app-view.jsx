
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import NetworkRepository from 'src/app-utils/network_repository';

import { Button, Card, CardHeader, Dialog, FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material';
import { addDays, format } from 'date-fns';
import { id } from 'date-fns/locale';

import { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { useSelector } from 'react-redux';
import { fShortenNumberIndian } from 'src/utils/format-number';
import AppCurrentVisits from '../app-current-visits';
import LineChart from '../app-line-chart';
import AppNewsUpdate from '../app-news-update';

import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------



export default function AppView() {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [open, setOpen] = useState(false); // State for dialog visibility

  const [loading, setLoading] = useState(false); // State for dialog visibility





  const fakeData = [
    { id: '1', employee: 'Garden Court Distilleries Private Limited', occupation: 'Sha Pratapchand Pukraj And Company', projects: 260.00, performance: fShortenNumberIndian(3710 * 260.00) },
    { id: '2', employee: 'Geeta Sugars', occupation: 'Provimi Animal Nutrition India Pvt Ltd. ', projects: 350.00, performance: 35.00 },
    { id: '3', employee: 'Balaji Sugars Sales And Marketing Private Limited', occupation: 'Reliance Retail Ltd', projects: 420.00, performance: 3390.00 },
    { id: '4', employee: 'Padam Sugar & Co', occupation: 'Garden Court Distilleries Private Limited', projects: 270.00, performance: 3680.00 },
    { id: '5', employee: 'Del Monte Foods Private Limited', occupation: 'Del Monte Foods Private Limited', projects: 350.00, performance: 3540.00 },

  ];

  const fakeDataCity = [
    { id: '1', employee: 'Jamkhandi', occupation: 'Bagalkot', projects: 300000.00, performance: 19 },
    { id: '2', employee: 'Ratnagiri', occupation: 'Ratnagiri', projects: 250000.00, performance: 739 },
    { id: '3', employee: 'Kakinada (Urban)', occupation: 'East Godavari', projects: 166640, performance: 597 },
    { id: '4', employee: 'Mangalore', occupation: 'Dakshina Kannada', projects: 149526.00, performance: 512 },
    { id: '5', employee: 'Gorakhpur', occupation: 'Gorakhpur', projects: 1248250.0, performance: 434 },

  ];

  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['weaky', ''],
    legend: {
      show: false,
    }
  };

  const [selectedValue, setSelectedValue] = useState('');

  ;



  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  });

  const handleDateRangeChange = (ranges) => {
    setSelectedRange(ranges.selection);
  };

  const [data, setData] = useState({});


  // Function to fetch invoice stats for a single date
  const fetchInvoiceStatsForDate = async (date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const invoiceStats = await NetworkRepository.getInvoiceStatsForDate(formattedDate, '');
      console.log('sdfsdfsdfsdfsdfsdfsd',invoiceStats);
      setData(invoiceStats);
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch invoice stats for a date range
  const fetchInvoiceStatsForRange = async (startDate, endDate) => {
    setLoading(true);
    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      const invoiceStats = await NetworkRepository.getInvoiceStats(formattedStartDate, formattedEndDate, '');
      setData(invoiceStats);
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data based on the selected range
  useEffect(() => {
    if (selectedRange.startDate === selectedRange.endDate) {
      console.log('sdfsdfsdfsdfsdfsdfsdf');
      fetchInvoiceStatsForDate(selectedRange.startDate); // Fetch stats for single date
    } else {
      fetchInvoiceStatsForRange(selectedRange.startDate, selectedRange.endDate); // Fetch stats for date range
    }
  }, [selectedRange]);


  useEffect(() => { }, [
    data])


  console.log('data', data);


  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
        <Typography variant="h4">
          Hi, {selectedUser.name && selectedUser.name.charAt(0).toUpperCase() + selectedUser.name.slice(1)} 👋
        </Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Select Date Range ({format(selectedRange.startDate, 'MMM/dd/yyyy')} - {format(selectedRange.endDate, 'MMM/dd/yyyy')})
        </Button>
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

      </Tabs>


      {value === 0 && (
        <Grid container spacing={5} mt={0.2}>

          <Grid xs={12} sm={6} md={4} >
            {!loading ? (<AppWidgetSummary
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
            <AppWidgetSummary
              title="Total Sale amount"
              useShotHand
              total={data.totals?.total_invoice_amount}
              color="warning"
              icon={<img src="/assets/dashboard/sales-report.svg" alt="" />}
            />
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
                      data: [
                        // Data for '05/25/2024'
                        [new Date(2024, 4, 23).getTime(), 90],
                        // Data for '05/26/2024'
                        [new Date(2024, 4, 24).getTime(), 110],
                        // Data for '05/27/2024'
                        [new Date(2024, 4, 25).getTime(), 60],
                        // Data for '05/28/2024'
                        [new Date(2024, 4, 26).getTime(), 150],
                        // Data for '05/29/2024'
                        [new Date(2024, 4, 27).getTime(), 100],
                        // Data for '05/30/2024'
                        [new Date(2024, 4, 28).getTime(), 82],

                        [new Date(2024, 4, 29).getTime(), 170],
                        // Add more data arrays for additional dates as needed
                      ],
                    },
                    // Add more series as needed
                  ],
                  invoiceData: data.details // Assuming PromiseResult.details holds the invoice data
                }}
              />
            ) : (<Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />)}
          </Grid>

          <Grid xs={12} md={4} lg={4}>
            {data && data?.trader_data && (<AppNewsUpdate
              title="Top 10 Traders"
              list={data?.trader_data?.slice(0, 10).map((trader, index) => ({
                id: trader?.invoice_count || '',
                title: trader.phone_number || '',
                description: trader?.trader || '',
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: trader?.invoice_qty,
              }))}
            />)}
          </Grid>

          <Grid xs={12} md={8} lg={8}>
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
                    {fakeData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.employee}</TableCell>
                        <TableCell>{row.occupation}</TableCell>
                        <TableCell>{row.projects}</TableCell>
                        <TableCell>{row.performance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </Card>

          </Grid>


          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Product sales"
              chart={{
                series: [

                  { label: 'S1-30', value: 5435 },
                  { label: 'S2-30', value: 1443 },
                  { label: 'M-30', value: 4443 },
                ],
              }}
            />
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
                      {fakeDataCity.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell >{row.employee}</TableCell>
                          <TableCell>{row.occupation}</TableCell>
                          <TableCell>{row.performance}</TableCell>
                          <TableCell>{row.projects}</TableCell>

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
        <Grid container spacing={5} mt={0.2} >

          <Grid xs={12} md={8} lg={8}>
            <LineChart />
          </Grid>

          <Grid xs={12} md={4} lg={4}>

            <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <FormControl fullWidth>
                <InputLabel id="select-label" sx={{ ml: 5, mt: 2 }}>Select Option</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  value={selectedValue}
                  onChange={handleChange}
                  sx={{ mx: 5, my: 2 }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Storehouse</TableCell>
                      <TableCell>QTY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Godown 1</TableCell>
                      <TableCell>10</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Godown 2</TableCell>
                      <TableCell>20</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Godown 3</TableCell>
                      <TableCell>25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Godown 4</TableCell>
                      <TableCell>30</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Godown 5</TableCell>
                      <TableCell>35</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Godown 6</TableCell>
                      <TableCell>5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Godown 7</TableCell>
                      <TableCell>15</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

      )}
      <Dialog open={open} onClose={() => setOpen(false)} sx={{ width: '80%' }} PaperProps={{
        sx: {
          width: "80%",
          maxWidth: "80%!important",
        },
      }}>
        <DateRangePicker
          locale={id}
          onChange={handleDateRangeChange}
          showSelectionPreview
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={[selectedRange]}
          direction="horizontal"
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </Container>
  );
}


