import { Alert, Autocomplete, Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

const InboundForm = () => {
  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouseData] = useState([]);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const availableUOMs = ['MT', 'QTL'];
  const [uom, setUOM] = useState('');

  const getMillsProducts = () => {
    const mills = selectedUserConfig.seller.mills || [];
    const products = [];
    mills.forEach(mill => {
      products.push(...mill.products);
    });
    return products;
  };

  const millsProducts = getMillsProducts();

  const [productOptions, setProductOption] = useState(millsProducts);
  const [batchNumberOptions, setBatchNumberOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  console.log('batchNumberOptions', batchNumberOptions)


  const inbounds = useSelector((state) => state.warehouseUpdate.inbounds);

  const isUpdate = Object.keys(inbounds).length === 0;





  const [formData, setFormData] = useState({
    inboundNo: '',
    warehouse: null,
    inboundDate: '',
    inboundType: '',
    poNumber: '',
    fromWarehouse: '',
    createdBy: selectedUserConfig.seller.name,
    approvedBy: '',
    mill: '',
  });

  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    'product': null,
    'batch_num': null,
    'qty': '',
    'uom': '', // Initialize uom to an empty string
    'location': '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

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
    console.log('productData', productData)
    if (
      productData.product && // productData.batch_num &&
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
      setSnackbarMessage('All fields are required for adding a product.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedProducts = products.map(product => ({
      product: product.product.id,
      batch_num: product?.batch_num?.value ?? null,
      qty: product.qty,
      uom: product.uom,
      location: product.location.value,
    }));

    console.log('formattedProducts', formattedProducts)


    try {
      const response = await NetworkRepository.postInbound(
        formData.warehouse,
        formData.inboundType,
        formData.fromWarehouse,
        formData.poNumber,
        selectedUserConfig.seller.user,
        formattedProducts,
      );

      if (response) {
        setSnackbarMessage(response);
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
      inboundNo: '',
      warehouse: '',
      inboundDate: '',
      inboundType: '',
      poNumber: '',
      fromWarehouse: '',
      createdBy: selectedUserConfig.seller.name,
      approvedBy: selectedUserConfig.seller.name,
      mill: '',
    });
    setProducts([]);
  };

  useEffect(() => {
    const fetchWareHouseBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getWarehouseList(formData.mill);
        setWarehouseData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWareHouseBatchData();
  }, [formData.mill]);

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


  useEffect(() => {
    if (!isUpdate) {

      setFormData({
        inboundNo: inbounds.inbound_num || '',
        warehouse: inbounds.ware_house.id || '',
        inboundDate: inbounds.created_date ? inbounds.created_date.split('T')[0] : '',
        inboundType: inbounds.inbound_type || '',
        poNumber: inbounds.po_num || '',
        fromWarehouse: inbounds.from_warehouse || '',
        createdBy: inbounds.created_by?.seller?.name || '',
        approvedBy: inbounds.approved_by?.seller?.name || '',
        mill: '',
      });

      setProducts(inbounds.inbound_details)
    }
  }, [inbounds, isUpdate]);


  console.log('products', products)

  console.log('inboundsformData', selectedUserConfig.seller.mills)


  console.log('productData.product', productData.product)

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
        <Typography variant="h4" gutterBottom>Add Inbound</Typography>
        <Card sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* <TextField
                label="Inbound No"
                name="inboundNo"
                value={formData.inboundNo}
                disabled={!isUpdate}
                onChange={handleFormChange}
                fullWidth
              /> */}


              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="mill">Mill</InputLabel>
                  <Select
                    id="mill"
                    name="mill"
                    value={formData.mill}
                    onChange={handleFormChange}
                  >
                    {selectedUserConfig.seller.mills.map(mill => (
                      <MenuItem key={mill.id} value={mill.id}>
                        {mill.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Your other form fields */}
              </Stack>


              <FormControl fullWidth>
                <InputLabel htmlFor="warehouse">{isUpdate ? "Warehouse" : ""}</InputLabel>
                <Select
                  id="warehouse"
                  name="warehouse"
                  disabled={!isUpdate || !formData.mill}
                  value={formData.warehouse}
                  onChange={handleFormChange}
                >
                  {warehouse?.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Inbound Date"
                name="inboundDate"
                type="date"
                disabled={!isUpdate}
                value={formData.inboundDate}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel htmlFor="inboundType">Inbound Type</InputLabel>
                <Select
                  id="inboundType"
                  name="inboundType"
                  disabled={!isUpdate}
                  value={formData.inboundType}
                  onChange={handleFormChange}
                >
                  <MenuItem value="Production">Production</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="StockTransfer">Stock Transfer</MenuItem>
                  <MenuItem value="Adjustment">Adjustment</MenuItem>
                  <MenuItem value="Reversal">Reversal</MenuItem>
                </Select>
              </FormControl>
              {!(formData.inboundType !== 'Purchase') && (<TextField
                label="PO Number"
                name="poNumber"

                value={formData.poNumber}
                onChange={handleFormChange}
                fullWidth
              />)}

              {formData.inboundType === 'StockTransfer' && (<FormControl fullWidth>
                <InputLabel htmlFor="fromWarehouse">From Warehouse</InputLabel>
                <Select
                  id="fromWarehouse"
                  name="fromWarehouse"

                  value={formData.fromWarehouse}
                  onChange={handleFormChange}
                >
                  {warehouse.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>)}

              <TextField
                label="Created by"
                name="createdBy"
                focused={formData.approvedBy?.seller?.name !== null}
                value={formData.createdBy}
                onChange={handleFormChange}
                fullWidth
                disabled
              />
              <TextField
                label="Approved By Employee"
                name="approvedBy"
                focused={formData.approvedBy?.seller?.name === null}
                value={formData.approvedBy?.seller?.name}
                onChange={handleFormChange}
                fullWidth
                disabled
              />
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Inbound Product Details</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="product"
                      name="product"
                      options={productOptions}
                      getOptionLabel={(option) => `${option.product_type.product_type} (${option.code})`} // Assuming 'name' is the property you want to use
                      value={productData.product}
                      onChange={(event, newValue) => {
                        setProductData({ ...productData, product: newValue })
                        handleProductChange({ target: { name: 'uom', value: newValue.product_type.unit } }); // Corrected handleProductChange call
                      }}
                      renderInput={(params) => <TextField {...params} label="Product" />}
                      fullWidth
                    />

                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="batch_num"
                      name="batch_num"
                      disabled={!isUpdate}
                      options={batchNumberOptions}
                      getOptionLabel={(option) => option.label || ""}
                      value={productData.batch_num}
                      onChange={(event, newValue) => setProductData({ ...productData, batch_num: newValue })}
                      renderInput={(params) => <TextField {...params} label="Batch Number" />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      name="qty"
                      disabled={!isUpdate}
                      value={productData.qty}
                      onChange={handleProductChange}
                      type="number"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      options={locationOptions}
                      value={productData.location}
                      disabled={formData.warehouse === null}
                      onChange={(event, newValue) => {
                        handleProductChange({ target: { name: 'location', value: newValue } });
                      }}
                      renderInput={(params) => <TextField {...params} label="Location" fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="uom-label">Unit of Measure (UOM)</InputLabel>
                      <Select
                        labelId="uom-label"
                        id="uom"
                        value={productData.uom}
                        disabled
                        label="Unit of Measure (UOM)"
                        name="uom"
                        onChange={(event) => {
                          handleProductChange({ target: { name: 'uom', value: event.target.value } });
                        }}
                      >
                        {availableUOMs.map((item) => (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" disabled={!isUpdate} onClick={addProduct}>
                      <Box m={1}>
                        Add Product
                      </Box>
                    </Button>
                  </Grid>
                </Grid>
              </Stack>

              <TableContainer component={Card} sx={{ mt: 3 }}>
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
                    {products?.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.product.code ? product.product.code : product.product.product_type}</TableCell>
                        <TableCell>
                          {product.batch_num ? (product.batch_num.batch_num || product.batch_num.label || 'N/A') : 'N/A'}
                        </TableCell>
                        <TableCell>{product.qty}</TableCell>
                        <TableCell>{product.uom}</TableCell>
                        <TableCell>{product.location ? product.location.label : 'N/A'}</TableCell>
                        <TableCell>
                          <Button variant="outlined" disabled={!isUpdate} color="secondary" onClick={() => {
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
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" disabled={!isUpdate} color="primary" type="submit">Save</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
            </Stack>
          </form>
        </Card>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default InboundForm;
