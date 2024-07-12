import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWareHouseTab } from 'src/redux/actions/tab-step-action';
import InboundTable from './inbound/inbound-table';
import LocationsTableView from './locations/locations-table';
import OutboundTable from './outbound/outbound-table';
import ProductsBatch from './product-batch/product-batch-table';
import ProductsManufacturing from './product-manufacture/product-batch-manufacturing-list';
import StockLedgerTable from './stock-ledger/stock-ledger-table';
import WarehouseTableView from './warehouse/warehouse-table';

export default function WarehouseView() {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.tabSteps.warehouseStepState);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const sellerRoles = selectedUserConfig?.seller?.seller_role || [];

  const [tab, setTab] = useState(0); // Initialize tab state properly

  // Update local tab state when Redux state changes
  useEffect(() => {
    setTab(selectedTab);
  }, [selectedTab]);

  const selectTabState = (newValue) => {
    dispatch(selectWareHouseTab(newValue)); // Dispatch Redux action
    setTab(newValue); // Update local state
  };

  const canAccessWarehouse = sellerRoles.includes(1) || sellerRoles.includes(2) || sellerRoles.includes(3);
  const canAccessProductBatch = sellerRoles.includes(1) || sellerRoles.includes(2);
  const canAccessLocations = sellerRoles.includes(1) || sellerRoles.includes(2) || sellerRoles.includes(3);

  const canAccessProductBatchMFG = sellerRoles.includes(1) || sellerRoles.includes(2);
  const canAccessInboundTable = sellerRoles.includes(1) || sellerRoles.includes(2) || sellerRoles.includes(3);
  const canAccessOutbound = sellerRoles.includes(1) || sellerRoles.includes(2) || sellerRoles.includes(3);
  const canAccessStockLedger = sellerRoles.includes(1) || sellerRoles.includes(2) || sellerRoles.includes(3);

  // Define your tabs configuration
  const tabsConfig = [
    { label: 'Warehouse', component: <WarehouseTableView />, visible: canAccessWarehouse },
    { label: 'Locations', component: <LocationsTableView />, visible: canAccessLocations },
    { label: 'Product batch', component: <ProductsBatch />, visible: canAccessProductBatch },
    { label: 'Product batch MFG', component: <ProductsManufacturing />, visible: canAccessProductBatchMFG },
    { label: 'Inbound', component: <InboundTable />, visible: canAccessInboundTable },
    { label: 'Outbound', component: <OutboundTable />, visible: canAccessOutbound },
    { label: 'Stock Ledger', component: <StockLedgerTable />, visible: canAccessStockLedger },
  ];

  // Filter visible tabs and map their indices
  const visibleTabs = tabsConfig.filter(tabVisibel => tabVisibel.visible);
  const tabMap = visibleTabs.reduce((acc, curr, index) => {
    acc[curr.label] = index;
    return acc;
  }, {});

  const getTabIndex = (tabLabel) => (
    tabMap[tabLabel] !== undefined ? tabMap[tabLabel] : 0
  );

  return (
    <Container maxWidth="xl">
      <Tabs
        value={tab}
        onChange={(event, newValue) => selectTabState(newValue)}
        textColor="primary"
        variant="scrollable"
        allowScrollButtonsMobile
        indicatorColor="primary"
        style={{
          marginBottom: '2px',
          marginTop: '-12px',
          marginBlock: 5,
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
          position: 'fixed',
          zIndex: 2,
          backgroundColor: '#f9fafb',
        }}
      >
        {visibleTabs.map((vtab, index) => (
          <Tab key={index} label={vtab.label} style={{ marginLeft: '-16px' }} />
        ))}
      </Tabs>
      <Box sx={{ paddingTop: '65px' }}>
        {visibleTabs.map((currTab, index) => (
          <Box key={index} hidden={getTabIndex(currTab.label) !== tab}>
            {currTab.component}
          </Box>
        ))}
      </Box>
    </Container>
  );
}
