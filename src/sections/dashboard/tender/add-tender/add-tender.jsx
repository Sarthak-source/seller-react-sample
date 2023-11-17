import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';


export default function TenderCreate() {
  const theme = useTheme();
  const [tenderValue, setTenderValue] = useState('');
  const [millValue, setMillValue] = useState({});
  const [millName, setMillName] = useState('');
  const [millId, setMillId] = useState('');
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState('');
  const [qtyUnit, setQtyUnit] = useState('');
  const [tenderType, setTenderType] = useState(['Fixed', 'Open', 'OpenPlusLanded']);
  const [mill, setMill] = useState(['Test Mill Private Limited', 'Test Mill Private Limited (Unit-1)']);

  const [quantityController, setQuantityController] = useState('');
  const [remarkController, setRemarkController] = useState('');
  const [rateController, setRateController] = useState('');
  const [product, setProduct] = useState([]);
  const [call, setCall] = useState(true);
  const [select, setSelect] = useState([]);
  const [selectedName, setSelectedName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (call) {
          const response = await NetworkRepository.sellerConfig();
          setMill(response.seller.mills);
          setQtyUnit(response.seller.mills[0].products[0].product_type.unit.toString());
          setCall(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [call]);

  const handleTenderChange = (event) => {
    setTenderValue(event.target.value);
  };

  const handleMillChange = (newValue) => {
    setMillValue(newValue);
    setMillId(newValue.id);
    setMillName(newValue.name);
    setProduct(newValue.products);
  };

  const handleProductChange = (newValue) => {
    setProductName(newValue.name);
    setProductID(newValue.id.toString());
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

  const handleCheckboxChange = () => {
    // Your logic for handling checkbox change
  };

  const handleSubmit = async () => {
    try {
      if (tenderValue === '') {
        alert('Please select tender type.');
      } else if (millId === '') {
        alert('Please select mill.');
      } else if (productID === '') {
        alert('Please select product.');
      } else if (quantityController === '') {
        alert('Please enter quantity.');
      } else if (rateController === '' && tenderValue === 'Fixed') {
        alert('Please enter rate.');
      } else {
        // await NetworkRepository.tenderPostView({
        //   mill: millId,
        //   product: productID,
        //   qty: quantityController,
        //   price: rateController,
        //   seller: localStorage.getItem('sellerID'),
        //   isExclusive: select.length > 0,
        //   traderIds: select,
        //   remark: remarkController,
        //   tenderType: tenderValue,
        // });
        alert('Tender created successfully.');
        // Add logic to navigate or perform additional actions after creating the tender
      }
    } catch (error) {
      console.error('Error creating tender:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (


    <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" sx={{ pb: 2 }}>Add Tender</Typography>
        <Stack spacing={3} pb={5} pt={1}>


          <TextField
            select
            label="Tender Type"
            value={tenderValue}
            onChange={handleTenderChange}
            fullWidth
          >
            {tenderType.map((type) => (
              <option key={type} value={type} >
                {type}
              </option>
            ))}
          </TextField>
          <TextField
            select
            label="Mill"
            value={mill}
            onChange={handleTenderChange}
            fullWidth
          >
            {mill.map((type) => (
              <option key={type} value={type} >
                <Box pb={5} pl={2} pr={2}>
                  {type}
                </Box>

              </option>
            ))}
          </TextField>
          <TextField
            name="quatity"
            label="Quatity"
          />
          <TextField
            name="remarks"
            label="Remarks"
          />
          <TenderBuyerSelection />

        </Stack>
        {/* Add other form fields based on your requirements */}
        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}

        >
          Submit
        </LoadingButton>
      </Card>
    </Stack>

  );
};



const TenderBuyerSelection = () => {
  const [select, setSelect] = useState([]);
  const [selectedName, setSelectedName] = useState([]);
  const [callApi, setCallApi] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckboxChange = () => {
    // Your logic for handling checkbox change
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDialogClose = () => {
    setCallApi(false);
    // Close the dialog or handle other actions
  };

  const handleBuyerSelection = (id, name) => {
    if (select.includes(id)) {
      setSelect(select.filter((buyerId) => buyerId !== id));
      setSelectedName(selectedName.filter((buyerName) => buyerName !== name));
    } else {
      setSelect([...select, id]);
      setSelectedName([...selectedName, name]);
    }
  };

  const filteredData = []; // Replace with your actual array of buyer data

  return (
    <Card>
      <Stack direction="row" alignItems="center" spacing={1} pr={2} pl={1} pt={2} pb={2}>
        <Checkbox />
        <Typography variant="body1" style={{ fontSize: 14 }}>
          Is Exclusive
        </Typography>
      </Stack>

    </Card>
  );
};

