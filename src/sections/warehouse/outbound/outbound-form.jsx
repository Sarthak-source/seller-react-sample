import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const OutboundForm = () => {
  const [formData, setFormData] = useState({
    outboundNo: '',
    warehouse: '',
    outboundDate: '',
    outboundType: '',
    poNumber: '',
    fromWarehouse: '',
    createdBy: 'Login Employee', // Assume this is fetched from the login context
    approvedBy: 'Login Employee', // Assume this is fetched from the login context
  });

  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    product: '',
    batchNumber: '',
    quantity: '',
    uom: '',
    location: '',
  });

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
    setProducts((prevProducts) => [...prevProducts, productData]);
    setProductData({
      product: '',
      batchNumber: '',
      quantity: '',
      uom: '',
      location: '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the form data here
    console.log('Form Data:', formData);
    console.log('Products:', products);
  };

  const handleCancel = () => {
    // Reset the form
    setFormData({
      outboundNo: '',
      warehouse: '',
      outboundDate: '',
      outboundType: '',
      poNumber: '',
      fromWarehouse: '',
      createdBy: 'Login Employee',
      approvedBy: 'Login Employee',
    });
    setProducts([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Add Outbound</Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Outbound No"
              name="OutboundNo"
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
                <MenuItem value="warehouse1">Warehouse 1</MenuItem>
                <MenuItem value="warehouse2">Warehouse 2</MenuItem>
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
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="stockTransfer">Stock Transfer</MenuItem>
                <MenuItem value="adjustment">Adjustment</MenuItem>
                <MenuItem value="reversal">Reversal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="PO Number"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="fromWarehouse">From Warehouse</InputLabel>
              <Select
                id="fromWarehouse"
                name="fromWarehouse"
                value={formData.fromWarehouse}
                onChange={handleFormChange}
              >
                <MenuItem value="warehouse1">Warehouse 1</MenuItem>
                <MenuItem value="warehouse2">Warehouse 2</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Created By Employee"
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
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Product"
                name="product"
                value={productData.product}
                onChange={handleProductChange}
              />
              <TextField
                label="Batch Number"
                name="batchNumber"
                value={productData.batchNumber}
                onChange={handleProductChange}
              />
              <TextField
                label="Quantity"
                name="quantity"
                value={productData.quantity}
                onChange={handleProductChange}
                type="number"
              />
              <TextField
                label="UOM"
                name="uom"
                value={productData.uom}
                onChange={handleProductChange}
              />
              <TextField
                label="Location"
                name="location"
                value={productData.location}
                onChange={handleProductChange}
              />
              <Button variant="contained" onClick={addProduct}>Add Product</Button>
            </Stack>
            <TableContainer component={Card} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sl. No</TableCell>
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
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.product}</TableCell>
                      <TableCell>{product.batchNumber}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.uom}</TableCell>
                      <TableCell>{product.location}</TableCell>
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
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">Save</Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
};

export default OutboundForm;
