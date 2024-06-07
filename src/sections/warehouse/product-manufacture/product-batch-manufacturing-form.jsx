import {
    Button,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

export default function ProductMFGBatchForm() {
    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState('');
    const [plant, setPlant] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [manufacturingDate, setManufacturingDate] = useState(null);
    const [manufacturingQty, setManufacturingQty] = useState('');
    const [expiryDate, setExpiryDate] = useState(null);
    const [uom, setUOM] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
    const productMFGBatch = useSelector((state) => state.warehouseUpdate.productMFGbatches);

    console.log('productMFGBatch', productMFGBatch)

    const isUpdate = Object.keys(productMFGBatch).length !== 0;


    const availableUOMs = ['Mt', 'Qtl'];

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
            case 'manufacturingQty':
                setManufacturingQty(value);
                break;
            case 'uom':
                setUOM(value);
                break;
            default:
                break;
        }
    };

    console.log('selectedUserConfig', selectedUserConfig)

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedManufacturingDate = manufacturingDate ? formatDate(manufacturingDate) : null;
        const formattedExpiryDate = expiryDate ? formatDate(expiryDate) : null;

        // Form validation (optional)
        if (!product || !plant || !manufacturingQty || !expiryDate || !uom) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            if (isUpdate) {
                // Logic for updating existing entry
                await NetworkRepository.updateProductMFGBatch(
                    productMFGBatch.id,
                    product,
                    plant,
                    batchNumber,
                    formattedManufacturingDate,
                    formattedExpiryDate,
                    manufacturingQty,
                    uom,
                    selectedUserConfig.seller.user
                );

                setSnackbarMessage('Data updated successfully');
            } else {
                // Logic for adding new entry
                await NetworkRepository.postProductMFGBatch(
                    product,
                    plant,
                    batchNumber,
                    formattedManufacturingDate,
                    formattedExpiryDate,
                    manufacturingQty,
                    uom,
                    selectedUserConfig.seller.user
                );

                setSnackbarMessage('Data saved successfully');
            }

            setSnackbarOpen(true);

            // Clear the form after successful submission
            setProduct('');
            setPlant('');
            setBatchNumber('');
            setManufacturingDate(null);
            setManufacturingQty('');
            setExpiryDate(null);
            setUOM('');

        } catch (error) {
            setSnackbarMessage('Failed to save/update data');
            setSnackbarOpen(true);
        }
    };


    const formatDate = (date) => {
        const formattedDate = new Date(date);
        return formattedDate.toISOString().split('.')[0];
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchProductBatchData = async () => {
            try {
                setLoading(true);
                const data = await NetworkRepository.getProductBatchList(product);
                setProductData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (product !== '') {
            fetchProductBatchData();
        }
    }, [product]);


    useEffect(() => {
        if (isUpdate) {
            setProduct(productMFGBatch.id || '');
            setPlant(productMFGBatch.mill || '');
            setBatchNumber(productMFGBatch.batch_num || '');
            setManufacturingDate(productMFGBatch.mfg_date ? dayjs(productMFGBatch.mfg_date) : null);
            setManufacturingQty(productMFGBatch.mfg_qty || '');
            setExpiryDate(productMFGBatch.exp_date ? dayjs(productMFGBatch.exp_date) : null);
            setUOM(productMFGBatch.uom || '');
        }
    }, [productMFGBatch, isUpdate]);
    

console.log('manufacturingDate',manufacturingDate)


    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh', pt: 2 }}>
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
                <Typography variant="h4" sx={{ pb: 2 }}>Add Product Manufacturing Data</Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="product">Product</InputLabel>
                        <Select
                            labelId="product"
                            id="product"
                            value={product}
                            label="Product"
                            name="product"
                            onChange={handleChange}
                        >
                            {selectedUserConfig.seller.products.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.product_type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
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
                            {selectedUserConfig.seller.mills.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {productData.length > 0 && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="batchNumber">Batch Number</InputLabel>
                            <Select
                                labelId="batchNumber"
                                id="batchNumber"
                                value={batchNumber}
                                label="Batch Number"
                                name="batchNumber"
                                onChange={handleChange}
                            >
                                {productData.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>{item.batch_num} ({item.product_name})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Stack direction="row" spacing={2} mt={1}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Expiry Date"
                                value={expiryDate}
                                onChange={(date) => setExpiryDate(date)}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Manufacturing Date"
                                value={manufacturingDate}
                                onChange={(date) => setManufacturingDate(date)}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                            />
                        </LocalizationProvider>
                    </Stack>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="manufacturingQty"
                        label="Manufacturing Qty"
                        name="manufacturingQty"
                        value={manufacturingQty}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="uom">Unit of Measure (UOM)</InputLabel>
                        <Select
                            labelId="uom"
                            id="uom"
                            value={uom}
                            label="Unit of Measure (UOM)"
                            name="uom"
                            onChange={handleChange}
                        >
                            {availableUOMs.map((item) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained" color="primary">
                        Save
                    </Button>
                    <Button sx={{ mt: 2 }} type="button" fullWidth variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </form>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Stack>
    );
}
