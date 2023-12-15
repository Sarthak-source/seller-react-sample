import { useState } from 'react';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import DispatchReportView from './dispatch-reports/dispatch-report';
import ProductWiseReportView from './product-wise-report/product-wise-report';
import SeasonWiseReportView from './season-wise-report/season-wise-report';
import StockReportView from './stock-report/stock-report';
import StoreHouseReportView from './store-house-report/store-house-report';
import StoreHouseRD1ReportView from './store_house_rg1_report/store_house_rg1_report';
import WarehouseReportView from './warehouse-report/warehouse-report';


// ----------------------------------------------------------------------

export default function ReportView() {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="xl">
      <Typography variant='h4'>Reports</Typography>
      <Tabs
        value={tab}
        onChange={(event, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        style={{ marginBottom: '2%', display: 'flex', justifyContent: 'flex-start' }}
      >
        <Tab label="Warehouse report" style={{ marginLeft: '-16px' }}/> 
        <Tab label="Stock report"  />
        <Tab label="Product wise report" />
        <Tab label="Store house report" />
        <Tab label="Store house RG1 report" /> 
        <Tab label="Season-wise report" />
        <Tab label="Dispatch report" />
         
      </Tabs>

      {tab === 0 && <WarehouseReportView/>}
      {tab === 1 && <StockReportView/>}
      {tab === 2 && <ProductWiseReportView/>}
      {tab === 3 && <StoreHouseReportView/>}
      {tab === 4 && <StoreHouseRD1ReportView/>}
      {tab === 5 && <SeasonWiseReportView/>}
      {tab === 6 && <DispatchReportView/>}
      
    </Container>
  );
}
