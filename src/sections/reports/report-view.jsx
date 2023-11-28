import { useState } from 'react';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import ProductWiseReportView from './product-wise-report/product-wise-report';
import StockReportView from './stock-report/stock-report';
import StoreHouseReportView from './store-house-report/store-house-report';
import StoreHouseRD1ReportView from './store_house_rg1_report/store_house_rg1_report';


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
        <Tab label="Stock report" style={{ marginLeft: '-16px' }} />
        <Tab label="Product wise report" />
        <Tab label="Store house report" />
        <Tab label="Store house RG1 report" />  
      </Tabs>


      {tab === 0 && <StockReportView/>}
      {tab === 1 && <ProductWiseReportView/>}
      {tab === 2 && <StoreHouseReportView/>}
      {tab === 3 && <StoreHouseRD1ReportView/>}
    </Container>
  );
}
