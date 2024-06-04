import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Inventory from './inventory/inventory-table';
import Orders from './order/order-table';
import Products from './product/product-table';

// ----------------------------------------------------------------------

export default function WarehouseView() {
  const [tab, setTab] = useState(0);

  const selectTabState = (event, newValue) => {
    setTab(newValue)
  }
  return (
    <Container maxWidth="xl">

      {/* {fullScreenState && (
        <>Hi</>
      )} */}

     
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
          <Tab label="Product" style={{ marginLeft: '-18px' }} />
          <Tab label="Orders" />
          <Tab label="Inventory" />
         
        </Tabs>
      <Box sx={{
        paddingTop:  '50px'
      }}>
        {tab === 0 && <Products />}
        {tab === 1 && <Orders />}
        {tab === 2 && <Inventory />}
      </Box>
    </Container>
  );
}
