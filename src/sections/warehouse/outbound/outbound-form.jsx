import { Alert, Autocomplete, Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

const OutboundForm = () => {
  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouseData] = useState([]);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const availableUOMs = ['Mt', 'Qtl'];
  const [uom, setUOM] = useState('');
  const [productOptions, setProductOption] = useState(selectedUserConfig.seller.products);
  const [batchNumberOptions, setBatchNumberOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const outbounds = useSelector((state) => state.warehouseUpdate.outbounds);


  console.log('outbounds',outbounds)

  const [formData, setFormData] = useState({
    outboundNo: '',
    warehouse: null,
    outboundDate: '',
    outboundType: '',
    poNumber: '',
    toWarehouse: '',
    createdBy: selectedUserConfig.seller.name,
    approvedBy: '',
  });

  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    'product': null,
    'batch_num': null,
    'qty': '',
    'uom': '',
    'location': '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addProduct = () => {
    if (
      productData.product &&
      productData.batch_num &&
      productData.qty &&
      productData.uom &&
      productData.location
    ) {
      setProducts((prevProducts) => [...prevProducts, productData]);
      setProductData({
        'product': null,
        'batch_num': null,
        'qty': '',
        'uom': '',
        'location': '',
      });
    } else {
      alert('All fields are required for adding a product.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedProducts = products.map(product => ({
      product: product.product.id,
      batch_num: product.batch_num.value,
      qty: product.qty,
      uom: product.uom,
      location: product.location.value,
    }));

    try {
      const response = await NetworkRepository.postOutbound(
        formData.warehouse,
        formData.outboundType,
        formData.toWarehouse,
        formData.poNumber,
        selectedUserConfig.seller.user,
        formattedProducts,
      );

      if (response) {
        setSnackbarMessage('Outbound data submitted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCancel();
      } else {
        throw new Error('Failed to submit data');
      }
    } catch (error) {
      setSnackbarMessage(`Error: ${error.toString()}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      outboundNo: '',
      warehouse: '',
      outboundDate: '',
      outboundType: '',
      poNumber: '',
      toWarehouse: '',
      createdBy: selectedUserConfig.seller.name,
      approvedBy: selectedUserConfig.seller.name,
    });
    setProducts([]);
  };

  useEffect(() => {
    const fetchWareHouseBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getWarehouseList(selectedUserConfig.seller.id);
        setWarehouseData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWareHouseBatchData();
  }, [selectedUserConfig]);

  useEffect(() => {
    const fetchProductBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getProductBatchList(productData.product.id);
        const options = data.map(item => ({
          label: `${item.product_name} (${item.batch_num})`,
          value: item.id,
        }));
        setBatchNumberOptions(options);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    if (productData.product !== null) {
      fetchProductBatchData();
    }

  }, [productData.product]);

  useEffect(() => {
    const fetchWarehouseLocationBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getWarehouseLocationList(formData.warehouse);
        const options = data.map(item => ({
          label: `${item.description}`,
          value: item.id,
        }));
        setLocationOptions(options);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    if (formData.warehouse !== null) {
      fetchWarehouseLocationBatchData();
    }

  }, [formData.warehouse]);

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ pt: 2 }}>
      <Card sx={{
        p: 5,
        width: 1,
        maxWidth: 600,
        borderRadius: '8px',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
        '&:hover': {
          boxShadow: '5px 5px 10px rgba(77, 182, 172,0.9)',
        },
      }}>
        <Typography variant="h4" gutterBottom>Add Outbound</Typography>
       
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Outbound No"
                name="outboundNo"
                value={formData.outboundNo}
                onChange={handleFormChange}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel htmlFor="warehouse">Warehouse</InputLabel>
                <Select
                  id="warehouse"
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleFormChange}
                >
                  {warehouse.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Outbound Date"
                name="outboundDate"
                type="date"
                value={formData.outboundDate}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel htmlFor="outboundType">Outbound Type</InputLabel>
                <Select
                  id="outboundType"
                  name="outboundType"
                  value={formData.outboundType}
                  onChange={handleFormChange}
                >
                  <MenuItem value="Production">Production</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="StockTransfer">Stock Transfer</MenuItem>
                  <MenuItem value="Adjustment">Adjustment</MenuItem>
                  <MenuItem value="Reversal">Reversal</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="PO Number"
                name="poNumber"
                disabled={formData.outboundType !== 'Purchase'}
                value={formData.poNumber}
                onChange={handleFormChange}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel htmlFor="toWarehouse">To Warehouse</InputLabel>
                <Select
                  id="toWarehouse"
                  name="toWarehouse"
                  disabled={formData.outboundType !== 'StockTransfer'}
                  value={formData.toWarehouse}
                  onChange={handleFormChange}
                >
                  {warehouse.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Created by"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleFormChange}
                fullWidth
                disabled
              />
              <TextField
                label="Approved By Employee"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleFormChange}
                fullWidth
                disabled
              />
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Outbound Product Details</Typography>
              <Stack direction="row" spacing={2} mb={2}>
                <Autocomplete
                  id="product"
                  name="product"
                  options={productOptions}
                  getOptionLabel={(option) => option.product_type} // Use the property that represents the label for each option
                  value={productData.product}
                  onChange={(event, newValue) => setProductData({ ...productData, product: newValue })}
                  renderInput={(params) => <TextField {...params} label="Product" />}
                  fullWidth
                />
                <Autocomplete
                  id="batch_num"
                  name="batch_num"
                  options={batchNumberOptions}
                  getOptionLabel={(option) => option.label || ""}
                  value={productData.batch_num}
                  onChange={(event, newValue) => setProductData({ ...productData, batch_num: newValue })}
                  renderInput={(params) => <TextField {...params} label="Batch Number" />}
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2} mb={2}>
                <TextField
                  label="Quantity"
                  name="qty"
                  value={productData.qty}
                  onChange={handleProductChange}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel htmlFor="uom">Unit of Measure</InputLabel>
                  <Select
                    id="uom"
                    name="uom"
                    value={productData.uom}
                    onChange={handleProductChange}
                  >
                    {availableUOMs.map((uoms) => (
                      <MenuItem key={uoms} value={uoms}>
                        {uoms}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2} mb={2}>
                <Autocomplete
                  id="location"
                  name="location"
                  options={locationOptions}
                  getOptionLabel={(option) => option.label || ""}
                  value={productData.location}
                  onChange={(event, newValue) => setProductData({ ...productData, location: newValue })}
                  renderInput={(params) => <TextField {...params} label="Warehouse Location" />}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addProduct}
                >
                  Add Product
                </Button>
              </Stack>
              <TableContainer component={Card} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Batch Number</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>UOM</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.product.product_type}</TableCell>
                        <TableCell>{product.batch_num.label}</TableCell>
                        <TableCell>{product.qty}</TableCell>
                        <TableCell>{product.uom}</TableCell>
                        <TableCell>{product.location.label}</TableCell>
                        <TableCell>
                          <Button variant="outlined" color="secondary" onClick={() => {
                            setProducts(products.filter((_, i) => i !== index));
                          }}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Stack direction="row" spacing={2} mt={3}>
              <Button type="submit" variant="contained" color="primary">Submit</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
            </Stack>
          </form>
       
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Card>
    </Stack>
  );
};

export default OutboundForm;
