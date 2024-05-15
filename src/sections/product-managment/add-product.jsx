import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useState } from 'react';

const ProductForm = () => {
    const [productType, setProductType] = useState('');
    const [productCode, setProductCode] = useState('');
    const [status, setStatus] = useState('active');

    const handleProductTypeChange = (event) => {
        setProductType(event.target.value);
    };

    const handleProductCodeChange = (event) => {
        setProductCode(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        console.log({ productType, productCode, status });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Product Code"
                variant="outlined"
                value={productCode}
                onChange={handleProductCodeChange}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="product-type-label">Product Type</InputLabel>
                <Select
                    labelId="product-type-label"
                    value={productType}
                    onChange={handleProductTypeChange}
                    label="Product Type"
                >
                    <MenuItem value="type1">Type 1</MenuItem>
                    <MenuItem value="type2">Type 2</MenuItem>
                    <MenuItem value="type3">Type 3</MenuItem>
                </Select>
            </FormControl>
            <FormControl component="fieldset" fullWidth margin="normal">
                <RadioGroup row aria-label="status" name="status" value={status} onChange={handleStatusChange}>
                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                    <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );
};

export default ProductForm;
