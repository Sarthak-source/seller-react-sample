import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import InboundTable from './inbound/inbound-table';
import OutboundTable from './outbound/outbound-table';
import ProductsBatch from './product/product-batch/product-batch-table';
import ProductsManufacturing from './product/product-manufacture/product-batch-manufacturing-list';
import StockLedgerTable from './stock-ledger/stock-ledger-table';
import WarehouseTableView from './warehouse/warehouse-table';

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
        <Tab label="Product batch" style={{ marginLeft: '-16px' }} />
        <Tab label="Product batch MFG" style={{ marginLeft: '-18px' }} />
        <Tab label="Warehouse" />
        <Tab label="Inbound" />
        <Tab label="Outbound" />
        <Tab label="Stock Ledger" />

      </Tabs>
      <Box sx={{
        paddingTop: '50px'
      }}>
        {tab === 0 && <ProductsBatch />}
        {tab === 1 && <ProductsManufacturing />}
        {tab === 2 && <WarehouseTableView />}
        {tab === 3 && <InboundTable />}
        {tab === 4 && <OutboundTable />}
        {tab === 5 && <StockLedgerTable />}
      </Box>
    </Container>
  );
}
