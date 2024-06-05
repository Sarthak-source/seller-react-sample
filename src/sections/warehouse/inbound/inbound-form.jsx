import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const InboundForm = () => {
  const [formData, setFormData] = useState({
    inboundNo: '',
    warehouse: '',
    inboundDate: '',
    inboundType: '',
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
      inboundNo: '',
      warehouse: '',
      inboundDate: '',
      inboundType: '',
      poNumber: '',
      fromWarehouse: '',
      createdBy: 'Login Employee',
      approvedBy: 'Login Employee',
    });
    setProducts([]);
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{  pt: 2 }}>


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
            <TextField
              label="Inbound No"
              name="inboundNo"
              value={formData.inboundNo}
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
              label="Inbound Date"
              name="inboundDate"
              type="date"
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
                value={formData.inboundType}
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
            <Typography variant="h6" gutterBottom>Inbound Product Details</Typography>
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
      </Card>

</Stack>
  );
};

export default InboundForm;
