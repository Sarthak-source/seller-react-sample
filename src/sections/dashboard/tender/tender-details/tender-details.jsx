import {
  Card,
  Container,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { selectOrder } from 'src/redux/actions/order-actions';
import NetworkRepository from '../../../../app-utils/network_repository';
import OrderTableRow from '../../orders/order-table-row/order-table-row';
import { useOrderTableFormate } from '../../orders/use-order-table-formate';
import TenderTableRow from '../tender-table-row/tender-table-row';
import { useTenderTableFormat } from '../use-tender-table-formate';

export default function TenderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [tenderDetailsData, setTenderDetailsData] = useState();
  const [tenderOrderData, setTenderOrderData] = useState();
  const { getStatusText, formatQty, formatQuantity, orderHeaderRow } = useOrderTableFormate();
  const { generateLocation, formatPrice, getPropertyValue, tenderHeaderRow } = useTenderTableFormat();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const tenderDetails = await NetworkRepository.tenderDetails(id);
        const tenderOrder = await NetworkRepository.tenderOrder(id);
        setTenderDetailsData(tenderDetails);
        setTenderOrderData(tenderOrder);
      } catch (error) {
        console.error('Error fetching tender data:', error);
      }
    };

    fetchDetails();
  }, [id]);

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
        Tender Summary
      </Typography>

      {tenderDetailsData && tenderOrderData && tenderOrderData.results ? (
        <Stack spacing={2} marginTop={10}>
          <Stepper orientation="vertical" sx={{
            '& .MuiStepConnector-line': {
              height: '200px',
            }
          }} >
            <Step>
              <StepLabel sx={{
                height: 30
              }}
              >
                <Stack>
                  <Typography
                    sx={{
                      marginTop: 6
                    }}
                    variant="h6"
                  >
                    Tenders
                  </Typography>
                  <Card sx={{ marginTop: 2 }}>
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
                            <TenderTableRow
                              key={tenderDetailsData.id}
                              tenderId={tenderDetailsData.id}
                              name={tenderDetailsData.mill.name}
                              location={generateLocation(tenderDetailsData.mill.location, tenderDetailsData.mill.state.name)}
                              date={format(parseISO(tenderDetailsData.date), 'MM/dd/yyyy')}
                              price={formatPrice(tenderDetailsData.price, tenderDetailsData.product.product_type.unit)}
                              status={tenderDetailsData.status}
                              tenderType={tenderDetailsData.tender_type}
                              productType={tenderDetailsData.product.product_type.product_type}
                              grade={getPropertyValue(tenderDetailsData.product.properties, 0, 'label', 'Not given')}
                              season={getPropertyValue(tenderDetailsData.product.properties, 0, 'value', 'Not given')}
                              total={tenderDetailsData.qty}
                              sold={tenderDetailsData.approved_qty}
                              balance={tenderDetailsData.available_qty}
                            />
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Card>
                </Stack>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel sx={{
                padding: 0,
                marginTop: '-120px',
                height: 'auto',
              }}
              >
                <Stack>
                  <Typography
                    sx={{
                      marginTop: 12
                    }}
                    variant="h6"
                  >
                    Orders
                  </Typography>
                  <Card sx={{ marginTop: 2 }}>
                    <Scrollbar>
                      <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                          <TableBody>
                            <TableHead>
                              {orderHeaderRow.map((label, index) => (
                                <TableCell key={index} sx={{ height: '40px' }}>
                                  {label.label}
                                </TableCell>
                              ))}
                            </TableHead>
                            {tenderOrderData.results.map((result, index) => (
                              <Link
                                key={result.id}
                                to={`/home/order-details/${result.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                                onClick={() => dispatch(selectOrder(result.tender_head))}
                              >
                                <OrderTableRow
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
                                />
                              </Link>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Card>
                </Stack>
              </StepLabel>
            </Step>
          </Stepper>
        </Stack>
      ) : (
        <Typography variant="h10">Tender details data is null</Typography>
      )}
    </Container>
  );
}
