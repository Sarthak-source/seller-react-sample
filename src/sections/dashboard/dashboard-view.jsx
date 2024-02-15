import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import { selectDashboardTab } from 'src/redux/actions/tab-step-action';
import { selectUser, selectUserConfig } from 'src/redux/actions/user-actions';
import DispatchesView from './dispatches/dispatches';
import OrdersView from './orders/orders';
import PaymentsView from './payments/payments';
import TenderView from './tender/tender';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const selectedTab = useSelector((state) => state.tabSteps.dashboardTabState);
  const [tab, setTab] = useState(selectedTab);

  const selectedUser = useSelector((state) => state.user.selectedUser);
  const dispatch = useDispatch();

  const selectTabState = (event, newValue) => {
    dispatch(selectDashboardTab(newValue));
    setTab(newValue)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configUserData = await NetworkRepository.sellerConfig(selectedUser.id);
  
        // Check if configUserData is not null and is an object
        if (configUserData && typeof configUserData === 'object') {
          dispatch(selectUser(configUserData.seller));
          dispatch(selectUserConfig(configUserData));
        } else {
          console.warn("configUserData is not iterable");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  
  }, [dispatch, selectedUser.id]);
  

  return (
    <Container maxWidth="xl">
      <Tabs
        value={tab}
        onChange={selectTabState}
        textColor="primary"
        indicatorColor="primary"

        style={{
          marginBottom: '2px',
          marginTop: -8,
          display: 'flex',
          width: "100%",
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
