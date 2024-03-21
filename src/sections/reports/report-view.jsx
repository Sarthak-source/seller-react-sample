import { useState } from 'react';

import { Button, MenuItem, Popover, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
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
  const [tabNew, setTabNew] = useState(0);


  const [anchorEl, setAnchorEl] = useState(null);

  const [selected, setSelected] = useState('Warehouse reports');


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };



  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuClick = (val) => {
    setSelected(val)
    handleClose()
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} >
        <Typography variant='h4' mt={1}>Reports</Typography>
        <Button sx={{ gap: 2 }} aria-describedby={id} variant="contained" onClick={handleClick}>
          <Iconify icon={open ? "icon-park-outline:up-c" : "icon-park-outline:down-c"} />
          {selected}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          maxWidth
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem gap={20} onClick={() => menuClick('Warehouse reports')}>
            <Iconify icon="ph:warehouse-duotone" sx={{ mr: 2.5 }} />
            Warehouse reports
          </MenuItem>
          <MenuItem onClick={() => menuClick('Dispatch reports')}>
            <Iconify icon="carbon:delivery-parcel" sx={{ mr: 2.5 }} />
            Dispatch reports
          </MenuItem>
        </Popover>
      </Stack>
      {
        selected === 'Warehouse reports' && (
          <Tabs
            value={tab}
            onChange={(event, newValue) => setTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons="auto"
            style={{
              marginBottom: '2%',
              marginTop: -6,
              marginLeft: -15,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Tab label="Warehouse report" style={{ marginLeft: '-16px' }} />
            <Tab label="Stock report" />
            <Tab label="Product wise report" />
            <Tab label="Store house report" />
            <Tab label="Store house RG1 report" />
            <Tab label="Season-wise report" />
          </Tabs>
        )
      }
      {
        selected === 'Dispatch reports' && (
          <Tabs
            value={tabNew}
            onChange={(event, newValue) => setTabNew(newValue)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons="auto"
            style={{
              marginBottom: '2%',
              marginTop: -6,
              marginLeft: -15,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Tab label="Dispatch report" style={{ marginLeft: '-16px' }} />
          </Tabs>
        )
      }

      {selected === 'Warehouse reports' && (
        <>
          {tab === 0 && <WarehouseReportView />}
          {tab === 1 && <StockReportView />}
          {tab === 2 && <ProductWiseReportView />}
          {tab === 3 && <StoreHouseReportView />}
          {tab === 4 && <StoreHouseRD1ReportView />}
          {tab === 5 && <SeasonWiseReportView />}
        </>
      )}

      {selected === 'Dispatch reports' && (
        <>
          {tabNew === 0 && <DispatchReportView />}
        </>
      )}
    </Container>
  );
}
