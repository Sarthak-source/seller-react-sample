import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import OrdersView from './orders/orders';
import TenderView from './tender/tender';
import PaymentsView from './payments/payments';
import DispatchesView from './dispatches/dispatches';

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
        style={{ marginBottom: '2%', display: 'flex', justifyContent: 'flex-start' }}
      >
        <Tab label="Tenders" style={{ marginLeft: '-18px' }} />
        <Tab label="Orders" />
        <Tab label="Payments" />
        <Tab label="Dispatches" />
      </Tabs>


      {tab === 0 && <TenderView />}
      {tab === 1 && <OrdersView/>}
      {tab === 2 && <PaymentsView/>}
      {tab === 3 && <DispatchesView/>}
    </Container>
  );
}
