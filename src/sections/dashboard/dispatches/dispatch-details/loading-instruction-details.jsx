import {
  Card,
  Container,
  Grid,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import Scrollbar from 'src/components/scrollbar';
import OrdersTableRow from '../../orders/order-table-row/order-table-row';
import { useOrderTableFormate } from '../../orders/use-order-table-formate';
import TenderTableRow from '../../tender/tender-table-row/tender-table-row';
import { useTenderTableFormat } from '../../tender/use-tender-table-formate';
import DispatchTableRow from '../dispatches-table-row/dispatch-table-row';
import QuatityCheckCard from '../quality-check-card';
import { useDispatchesTableFormat } from '../use-dispatches-table-formate';

export default function LoadingInstructionDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loadingInstructionDetailsData, setLoadingInstructionDetailsData] = useState({});
  const [tenderDetailsData, setTenderDetailsData] = useState([]);
  const [tenderOrderData, setTenderOrderData] = useState();
  const { getStatusText, formatQty, formatQuantity, orderHeaderRow } = useOrderTableFormate();
  const { generateLocation, formatPrice, getPropertyValue, tenderHeaderRow } = useTenderTableFormat();

  const { loadingInstructionHeaderRow } = useDispatchesTableFormat();
  const [loading, setLoading] = useState(true);

  console.log('loadingInstructionDetailsData', loadingInstructionDetailsData)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const loadingInstructionDetails = await NetworkRepository.loadingInstructionDetails(id);
        setLoadingInstructionDetailsData(loadingInstructionDetails);

        // Create an array to store promises for fetching tenderDetails and orderDetails
        const detailsPromises = loadingInstructionDetails.loadinginstruction.map(async (loadinginstruction) => {
          const tenderDetails = await NetworkRepository.tenderDetails(loadinginstruction.order_head.tender_head.id);

          const orderDetails = await NetworkRepository.orderSummary(loadinginstruction.order_head.id);
          console.log(' { loadinginstruction, tenderDetails, orderDetails }', { loadinginstruction, tenderDetails, orderDetails })
          return { loadinginstruction, tenderDetails, orderDetails };
        });

        // Wait for all promises to resolve
        const detailsResults = await Promise.all(detailsPromises);

        // Extract the results and update state
        const tenderDetails = detailsResults.map(result => result.tenderDetails);
        const orderDetailsData = detailsResults.map(result => result.orderDetails.order);

        console.log('tenderDetails dfdsf', tenderDetails)

        setTenderDetailsData(tenderDetails);
        setTenderOrderData(orderDetailsData);

      } catch (error) {
        console.error('Error fetching Dispatch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  console.log('tenderOrderData', tenderDetailsData)
  console.log('tenderOrderData', tenderOrderData)


  const getImageUrlAndTitleList = (item) => {
    const mapping = [
      {
        key: 'dl_img_frontside',
        title: 'Dl FrontSide Image',
      },
      {
        key: 'dl_img_backside',
        title: 'Dl BackSide Image',
      },
      {
        key: 'rc_img',
        title: 'RC',
      },
      {
        key: 'insurance_img',
        title: 'Insurance',
      },
      {
        key: 'driver_with_vehicle',
        title: 'Drive with vehicle',
      },
      {
        key: 'vehicle_body_img',
        title: 'Vehicle',
      },
    ];

    const imageUrlAndTitleList = mapping.map((mappingItem) => {
      const { key, title } = mappingItem;
      let imageUrl;

      try {
        imageUrl = item.loadinginstruction?.[0].quality_check?.driver?.[key];
      } catch (error) {
        // Handle the error, set imageUrl to a default value, or log the error
        console.error(`Error getting item image URL for key ${key}:`, error);
        imageUrl = ''; // Default value for imageUrl
      }

      return {
        imageUrl,
        title,
      };
    });

    return imageUrlAndTitleList;
  };

  return (
    <Container maxWidth="xl">
      <Typography
        sx={{
          paddingTop: '12px',
          paddingBottom: '20px',
          paddingRight: '20px',
        }}
        variant="h4"
      >
        Dispatch Summary
      </Typography>

      {loadingInstructionDetailsData && loadingInstructionDetailsData.loadinginstruction ? (
        <Stack spacing={2} >
          <Stepper orientation="vertical" active>
            <Step active expanded>
              <StepLabel><Typography variant='h6'>Dispatchs</Typography></StepLabel>
              <StepContent>
                <Card sx={{ marginTop: 2 }}>
                  <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead >
                          <TableRow>
                            {loadingInstructionHeaderRow.map((label, index) => (
                              <TableCell key={index} sx={{ height: '40px' }}>
                                {label.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            loadingInstructionDetailsData.loadinginstruction.map((loadinginstruction, index) => (
                              <DispatchTableRow
                                type='loadingsInstruction'
                                orderNo={loadinginstruction.order_head.id}
                                lrNum={loadinginstruction.lr_number}

                                millName={loadingInstructionDetailsData.mill}
                                name={loadingInstructionDetailsData.trader}
                                date={format(parseISO(loadinginstruction.date), 'MM/dd/yyyy')}
                                vehicleNumber={loadingInstructionDetailsData.vehicle_num}
                                quantity={loadingInstructionDetailsData.total_qty}
                                billedTo={`${loadinginstruction.billing_address.name}\n${loadingInstructionDetailsData.billing_gstin}\n${loadinginstruction.billing_address.address}`}
                                shipTo={`${loadinginstruction.address.name}\n${loadingInstructionDetailsData.address_gstin}\n${loadinginstruction.address.address}`}
                                rate={loadinginstruction.product != null ? loadinginstruction.order_head.price : 'Not given'}
                                grade={loadinginstruction.product != null ? loadinginstruction.product.code : 'Not given'}
                              />
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </Card>
              </StepContent>
            </Step>
            <Step active expanded>
              <StepLabel>
                <Typography variant='h6'>Orders</Typography>
              </StepLabel>
              <StepContent>
              {tenderOrderData ? (
                <Card sx={{ marginTop: 2,  }}>
                  <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                          {orderHeaderRow.map((label, index) => (
                            <TableCell key={index} sx={{ height: '40px' }}>
                              {label.label}
                            </TableCell>
                          ))}
                        </TableHead>
                        <TableBody>
                          {
                           tenderOrderData && tenderOrderData.map((result) => (
                              <OrdersTableRow
                                key={result.id}
                                ordersId={result.id}
                                traderName={result.trader.name}
                                millName={result.tender_head.mill.name}
                                date={format(parseISO(result.date), 'MM/dd/yyyy')}
                                price={`₹ ${result.price} ${result.tender_head.product.product_type.unit}`}
                                status={getStatusText(result.status)}
                                tenderType={result.tender_head.tender_type}
                                productType={result.tender_head.product.product_type.product_type}
                                grade={
                                  result.tender_head.product.properties.length > 0
                                    ? result.tender_head.product.properties[0].label
                                    : 'Not given'
                                }
                                season={
                                  result.tender_head.product.properties.length > 0
                                    ? result.tender_head.product.properties[0].value
                                    : 'Not given'
                                }
                                sale={formatQty(result.qty)}
                                loading={`${formatQuantity(
                                  result,
                                  'yet_to_load',
                                  result.yet_to_load
                                )} ${result.tender_head.product.product_type.unit}`}
                                dispatched={`${formatQuantity(
                                  result,
                                  'dispatched_qty',
                                  result.yet_to_load
                                )} ${result.tender_head.product.product_type.unit}`}
                                balance={`${formatQuantity(
                                  result,
                                  'available_qty',
                                  result.yet_to_load
                                )} ${result.tender_head.product.product_type.unit}`}
                                order={result.tender_head}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </Card>
              ) : (<Typography variant="subtitle1" marginLeft={4} paddingTop={4}>This Dispatch has no orders</Typography>)}
                
                </StepContent>

          

            </Step>
            <Step active expanded>
              <StepLabel><Typography variant='h6'>Tenders</Typography></StepLabel>

              <StepContent>

              <Card sx={{ marginTop: 2,  }}>
                <Scrollbar>
                  <TableContainer sx={{ overflow: 'unset' }}>
                    <Table sx={{ minWidth: 800 }}>
                      <TableHead >
                        <TableRow>
                          {tenderHeaderRow.map((label, index) => (
                            <TableCell key={index} sx={{ height: '40px' }}>
                              {label.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tenderDetailsData.map((tenderDetails) => (
                          <TenderTableRow
                            key={tenderDetails.id}
                            tenderId={tenderDetails.id}
                            name={tenderDetails.mill.name}
                            location={generateLocation(tenderDetails.mill.location, tenderDetails.mill.state.name)}
                            date={format(parseISO(tenderDetails.date), 'MM/dd/yyyy')}
                            price={formatPrice(tenderDetails.price, tenderDetails.product.product_type.unit)}
                            status={tenderDetails.status}
                            tenderType={tenderDetails.tender_type}
                            productType={tenderDetails.product.product_type.product_type}
                            grade={getPropertyValue(tenderDetails.product.properties, 0, 'label', 'Not given')}
                            season={getPropertyValue(tenderDetails.product.properties, 0, 'value', 'Not given')}
                            total={tenderDetails.qty}
                            sold={tenderDetails.approved_qty}
                            balance={tenderDetails.available_qty}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
                
              </StepContent>

              

            </Step>

            <Step active expanded>
              <StepLabel><Typography variant='h6'>Quality check</Typography></StepLabel>
              {
                loadingInstructionDetailsData.loadinginstruction?.[0].quality_check !== null ? (
                  <Grid container spacing={3} sx={{ marginTop: 2, marginLeft: 4, pr: 5 }}>
                    {getImageUrlAndTitleList(loadingInstructionDetailsData.loadinginstruction?.[0].quality_check).map((data) => (
                      <Grid key={data.title} xs={12} sm={6} md={3} sx={{ pr: 2, pb: 2 }}>
                        <QuatityCheckCard item={data} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <>No Quality check data</>
                )
              }
            </Step>
          </Stepper>
        </Stack>
      ) : (
        <Typography variant="h10">Dispatch details data is null</Typography>
      )}
    </Container>
  );
}