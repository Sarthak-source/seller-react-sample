import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function ProductBatchForm() {
    const [product, setProduct] = useState('');
    const [plant, setPlant] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [manufacturingDate, setManufacturingDate] = useState(new Date());
    const [manufacturingQty, setManufacturingQty] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date());

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'product':
                setProduct(value);
                break;
            case 'plant':
                setPlant(value);
                break;
            case 'batchNumber':
                setBatchNumber(value);
                break;
            case 'manufacturingDate':
                setManufacturingDate(event.target.valueAsDate);
                break;
            case 'manufacturingQty':
                setManufacturingQty(value);
                break;
            case 'expiryDate':
                setExpiryDate(event.target.valueAsDate);
                break;
            default:
                break;
        }
    };

    const handleAutoGenerate = (event) => {
       
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Form validation (optional)
        if (!product || !plant || !manufacturingQty || !expiryDate) {
            alert('Please fill in all required fields.');
            return;
        }

        // Submit the form data
        console.log('Product:', product);
        console.log('Plant:', plant);
        console.log('Batch Number:', batchNumber);
        console.log('Manufacturing Date:', manufacturingDate);
        console.log('Manufacturing Qty:', manufacturingQty);
        console.log('Expiry Date:', expiryDate);

        // Implement your form submission logic here (e.g., sending data to a server)
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
                    required
                >
                    <MenuItem value="product1">Product 1</MenuItem>
                    <MenuItem value="product2">Product 2</MenuItem>
                    <MenuItem value="product3">Product 3</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel htmlFor="plant">Plant</InputLabel>
                <Select
                    labelId="plant"
                    id="plant"
                    value={plant}
                    label="Plant"
                    name="plant"
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="plant1">Plant 1</MenuItem>
                    <MenuItem value="plant2">Plant 2</MenuItem>
                    <MenuItem value="plant3">Plant 3</MenuItem>
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
                InputProps={{
                    endAdornment: (
                        <Button variant="contained" size="small" onClick={handleAutoGenerate}>
                            Auto Gen
                        </Button>
                    ),
                }}
            />
        </form>
    )
}
