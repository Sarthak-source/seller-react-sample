import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { selectOrder } from 'src/redux/actions/order-actions';
import NetworkRepository from '../../../../app-utils/network_repository'; // Adjust the path
import OrderCard from '../../orders/order-details/components/order-card';
import HeaderCard from './components/head-card';

export default function TenderDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [tenderDetailsData, setTenderDetailsData] = useState();
  const [tenderOrderData, setTenderOrderData] = useState();


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
          paddingLeft: '40px',
          paddingTop: '12px',
          paddingBottom: '20px',
          paddingRight: '20px',
        }}
        variant="h4"
      >
        Tender Summary
      </Typography>
      <Scrollbar
        style={{
          paddingTop: 30,
          maxHeight: '100%',
          paddingLeft: '40px',
          paddingBottom: '12px',
          paddingRight: '20px',

          width: '100%',
        }}
      >
        {tenderDetailsData && tenderOrderData && tenderOrderData.results ? (
          <Grid container spacing={3}>
            {tenderDetailsData && (
              <Grid item xs={12} sm={6} md={3} paddingLeft={1} paddingRight={1} paddingBottom={2}>
                <HeaderCard data={tenderDetailsData} />
              </Grid>
            )}

            {tenderOrderData.results.map((result, index) => (
              <Grid item xs={12} sm={6} md={3} paddingLeft={1} paddingRight={1} paddingBottom={2} onClick={() => dispatch(selectOrder(result.tender_head))}>
                <OrderCard key={index} data={result.tender_head} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h10">Tender details data is null</Typography>
        )}
      </Scrollbar>
    </Container >
  );
}
