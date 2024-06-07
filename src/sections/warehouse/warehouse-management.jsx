import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import { selectWareHouseTab } from 'src/redux/actions/tab-step-action';
import InboundTable from './inbound/inbound-table';
import OutboundTable from './outbound/outbound-table';
import ProductsBatch from './product-batch/product-batch-table';
import ProductsManufacturing from './product-manufacture/product-batch-manufacturing-list';
import StockLedgerTable from './stock-ledger/stock-ledger-table';
import WarehouseTableView from './warehouse/warehouse-table';

// ----------------------------------------------------------------------

export default function WarehouseView() {
  const selectedTab = useSelector((state) => state.tabSteps.warehouseStepState);
  const dispatch = useDispatch();

  const [tab, setTab] = useState(selectedTab);

  const selectTabState = (event, newValue) => {
    dispatch(selectWareHouseTab(newValue));
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
        variant="scrollable"
        allowScrollButtonsMobile
        indicatorColor="primary"
        style={{
          marginBottom: '2px',
          marginTop: -10,
          marginBlock: 5,
          display: 'flex',
          width: "100%",
          justifyContent: 'flex-start',
          position: 'fixed',
          zIndex: 2,
          backgroundColor: '#f9fafb',
        }}
      >
        <Tab label="Product batch" style={{ marginLeft: '-16px' }} />
        <Tab label="Product batch MFG" />
        <Tab label="Warehouse" />
        <Tab label="Inbound" />
        <Tab label="Outbound" />
        <Tab label="Stock Ledger" />

      </Tabs>
      <Box sx={{
        paddingTop: '65px'
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
