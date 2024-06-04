import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const ProductBatchForm = () => {
  const [product, setProduct] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [batchStartDate, setBatchStartDate] = useState(new Date());
  const [batchEndDate, setBatchEndDate] = useState(new Date());
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'product':
        setProduct(value);
        break;
      case 'batchNumber':
        setBatchNumber(value);
        break;
      case 'batchStartDate':
        setBatchStartDate(value);
        break;
      case 'batchEndDate':
        setBatchEndDate(value);
        break;
      case 'status':
        setStatus(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the form data here
    console.log('Product:', product);
    console.log('Batch Number:', batchNumber);
    console.log('Batch Start Date:', batchStartDate);
    console.log('Batch End Date:', batchEndDate);
    console.log('Status:', status);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <InputLabel htmlFor="product">Product</InputLabel>
        <Select
          labelId="product"
          id="product"
          value={product}
          label="Product"
          name="product"
          onChange={handleChange}
        >
          <MenuItem value="product1">Product 1</MenuItem>
          <MenuItem value="product2">Product 2</MenuItem>
          <MenuItem value="product3">Product 3</MenuItem>
        </Select>
      </FormControl>
      <TextField
        margin="normal"
        required
        fullWidth
        id="batchNumber"
        label="Batch Number"
        name="batchNumber"
        value={batchNumber}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="batchStartDate"
        label="Batch Start Date"
        name="batchStartDate"
        type="date"
        defaultValue={batchStartDate}
        onChange={(event) => {
          setBatchStartDate(event.target.valueAsDate);
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="batchEndDate"
        label="Batch End Date"
        name="batchEndDate"
        type="date"
        defaultValue={batchEndDate}
        onChange={(event) => {
          setBatchEndDate(event.target.valueAsDate);
        }}
      />
      <FormControl fullWidth>
        <InputLabel htmlFor="status">Status</InputLabel>
        <Select
          labelId="status"
          id="status"
          value={status}
          label="Status"
          name="status"
          onChange={handleChange}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default ProductBatchForm;
