import PropTypes from 'prop-types';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, MenuItem, OutlinedInput, Select, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { fetchTraderData, fetchTraderDataStart } from 'src/redux/actions/traders';

export default function TenderCreate() {
  const theme = useTheme();
  const [tenderValue, setTenderValue] = useState('');
  const [millValue, setMillValue] = useState({});
  const [product, setProduct] = useState({});
  const [select, setSelect] = useState([]);

  const [qtyUnit, setQtyUnit] = useState('');
  const [tenderType, setTenderType] = useState(['Fixed', 'Open', 'OpenPlusLanded']);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [mills, setMill] = useState(selectedUser.mills);

  const [quantityController, setQuantityController] = useState('');
  const [remarkController, setRemarkController] = useState('');
  const [rateController, setRateController] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedSuffix, setSelectedSuffix] = useState(''); // Added state for the suffix


  const navigate = useNavigate();


  const handleTenderChange = (event) => {
    setTenderValue(event.target.value);
  };

  const handleMillChange = (newValue) => {
    setMillValue(newValue.target.value);

  };

  const handleSelectChange = (newSelect) => {
    setSelect(newSelect);
  };

  const handleProductChange = (newValue) => {
    console.log('handleProductChange', newValue.target.value)
    setSelectedSuffix(newValue.target.value.product_type.unit)
    setProduct(newValue.target.value);

  };

  const handleQuantityChange = (event) => {
    setQuantityController(event.target.value);
  };

  const handleRateChange = (event) => {
    setRateController(event.target.value);
  };

  const handleRemarkChange = (event) => {
    setRemarkController(event.target.value);
  };

  const selectedIds = select.map(item => item.id.toString());


  console.log('selectedIds', selectedIds)
  console.log('millValue', millValue)

  const nav = () => {
    setTimeout(() => {
      navigate(`/home/`);
    }, 2000);
  };


  const handleSubmit = async () => {
    try {
      if (tenderValue === '') {
        showSnackbar('Please select tender type.', 'error');
      } else if (millValue.id === '') {
        showSnackbar('Please select mill.', 'error');
      } else if (product.id === '') {
        showSnackbar('Please select product.', 'error');
      } else if (quantityController === '') {
        showSnackbar('Please enter quantity.', 'error');
      } else if (rateController === '' && tenderValue === 'Fixed') {
        showSnackbar('Please enter rate.', 'error');
      } else {
        await NetworkRepository.tenderPostView(
          millValue.id,
          product.id,
          quantityController,
          rateController ?? '',
          selectedUser.id,
          remarkController,
          selectedIds,
          select.length > 0,
          tenderValue,
        );

        // Your existing logic here
        showSnackbar('Tender created successfully.', 'success');
        nav();
      }
    } catch (error) {
      console.error('Error creating tender:', error);
      showSnackbar('Something went wrong. Please try again.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };



  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>
      <Card
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';

        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
        }}
        sx={{
          p: 5,
          width: 1,
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" sx={{ pb: 2 }}>Add Tender</Typography>
        <Stack spacing={3} pb={5} pt={1}>
          <Select
            value={tenderValue}
            onChange={handleTenderChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              Tender Type
            </MenuItem>
            {tenderType.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={Object.keys(millValue).length === 0 ? '' : millValue}
            onChange={handleMillChange}
            displayEmpty  // Use displayEmpty to show the initial empty value
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              Select Mill
            </MenuItem>
            {mills.map((mill) => (
              <MenuItem key={mill.id} value={mill}>
                {mill.name}
              </MenuItem>
            ))}
          </Select>

          {
            millValue && millValue.products && (
              <Select
                value={millValue && product ? product : ''}
                onChange={handleProductChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="" disabled>
                  Select Product
                </MenuItem>
                {millValue.products.map((product_selected) => (
                  <MenuItem key={product_selected.id} value={product_selected}>
                    {product_selected.code}
                  </MenuItem>
                ))}
              </Select>
            )
          }

          <TextField
            name="quantity"
            label="Quantity"
            value={quantityController}
            onChange={handleQuantityChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">{selectedSuffix}</InputAdornment>,
            }}
            fullWidth
          />

          {tenderValue && tenderValue === 'Fixed' ? (
            <TextField
              name="rate"
              label="Rate"
              value={rateController}
              onChange={handleRateChange}
              fullWidth
            />
          ) : null}

          <TextField
            name="remarks"
            label="Remarks"
            value={remarkController}
            onChange={handleRemarkChange}
            fullWidth
          />
          <TenderBuyerSelection onSelectChange={handleSelectChange} />

        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}


const TenderBuyerSelection = ({ onSelectChange }) => {
  const dispatch = useDispatch();
  const traders = useSelector((state) => state.traders.traderData);
  const [select, setSelect] = useState([]);
  const [traderData, setTraderData] = useState(traders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Array.isArray(traderData) && traderData.length === 0) {
          dispatch(fetchTraderDataStart());
          await dispatch(fetchTraderData());
        }
      } catch (error) {
        console.error('Error fetching trader data:', error);
      }
    };

    fetchData();
    setTraderData(traders);
  }, [dispatch, traderData, traders]);

  const handleCheckboxChange = () => {
    handleOpenDialog(!isExclusive);
    setSelect(isExclusive ? [] : select)
    setIsExclusive((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setIsExclusive(false || select.length > 0);
  };

  const handleBuyerSelection = (trader) => {
    if (select.includes(trader.id)) {
      setSelect(select.filter((buyerId) => buyerId !== trader.id));
    } else {
      setSelect([...select, trader]);
    }
    onSelectChange([...select, trader]);
  };


  const traderSearch = traderData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.billing_gstin && item.billing_gstin.gstin.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenDialog = (state) => {
    setOpenDialog(state);
  };

  return (
    <Card
      onMouseEnter={(e) => {
        e.currentTarget.style.borderRadius = '8px';
        e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';

      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderRadius = '8px';
        e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
      }}>
      <Stack direction="row" alignItems="center" spacing={1} pr={2} pl={1} pt={2} pb={2}>
        <Checkbox checked={isExclusive} onChange={handleCheckboxChange} />
        <Typography variant="body1" style={{ fontSize: 14 }}>
          Is Exclusive
        </Typography>
      </Stack>

      {

        select.length > 0 && (

          <List sx={{ pl: 2, pr: 2, pb: 1 }}>
            {select.map((trader) => (
              <Card
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderRadius = '8px';
                  e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';

                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderRadius = '8px';
                  e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                }}
                sx={{ mb: 1.5 }}
              >
                <ListItem key={`${trader.id}-${trader.name}`}>
                  <ListItemText

                    primary={trader.name}
                    secondary={`Phone: ${trader.phone_number}, Email: ${trader.email}`}
                  />
                </ListItem>
              </Card>

            ))}
          </List>
        )

      }

      {/* Your other content here */}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Select Traders</DialogTitle>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Select Traders</DialogTitle>
          <DialogContent sx={{ width: '400px' }}>
            <OutlinedInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='Search trader'
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    color='primary.main'
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
            />
            <List>
              {traderSearch.map((trader) => (
                <ListItem key={trader.id}>

                  <ListItemAvatar>
                    <Checkbox
                      edge="start"
                      checked={select.includes(trader)}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleBuyerSelection(trader)}
                    />
                  </ListItemAvatar>


                  <ListItemText

                    primary={trader.name}
                    secondary={`Phone: ${trader.phone_number}, Email: ${trader.email}`}
                  />
                  {/* Additional trader information if needed */}
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

TenderBuyerSelection.propTypes = {
  onSelectChange: PropTypes.func.isRequired,
};