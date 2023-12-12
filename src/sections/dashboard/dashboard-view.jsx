import { useState } from 'react';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Box } from '@mui/material';
import DispatchesView from './dispatches/dispatches';
import OrdersView from './orders/orders';
import PaymentsView from './payments/payments';
import TenderView from './tender/tender';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="xl">
      <Tabs
        value={tab}
        onChange={(event, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        
        style={{
          marginBottom: '2px',
          marginTop: '-1%',
          display: 'flex',
          width:"100%",
          justifyContent: 'flex-start',
          position: 'fixed',
          zIndex: 2,
          backgroundColor: '#f9fafb',
        }}
      >
        <Tab label="Tenders" style={{ marginLeft: '-18px' }} />
        <Tab label="Orders" />
        <Tab label="Payments" />
        <Tab label="Dispatches" />
      </Tabs>

      <Box sx={{
        paddingTop: '50px'
      }}>
        {tab === 0 && <TenderView />}
        {tab === 1 && <OrdersView />}
        {tab === 2 && <PaymentsView />}
        {tab === 3 && <DispatchesView />}
      </Box>



    </Container>
  );
}
