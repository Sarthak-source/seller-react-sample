import { Alert, Button, Card, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

const LocationForm = () => {
    const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);

    const [loading, setLoading] = useState(true);
    const [warehouseData, setWarehouseData] = useState([]);
    const [millData, setMillData] = useState(selectedUserConfig.seller.mills);

    const [formData, setFormData] = useState({
        ware_house: '',
        code: '',
        description: '',
        created_by: selectedUserConfig.seller.id, // Assuming user_id is the ID of the user
        mill: '', // Add mill to the form data
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

    console.log('selectedUserConfig.seller.mill', selectedUserConfig.seller.mills);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await NetworkRepository.postWarehouseLocation(formData.ware_house, formData.code, formData.description, formData.created_by, formData.mill);
            if (response) {
                setSnackbarMessage('Location added successfully.');
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
            ware_house: '',
            code: '',
            description: '',
            created_by: selectedUserConfig.seller.id,
            mill: '',
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const warehouseList = await NetworkRepository.getWarehouseList(formData.mill, selectedUserConfig.seller.id);
                setWarehouseData(warehouseList);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedUserConfig, formData.mill]);

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
                <Typography variant="h4" gutterBottom>Add Location</Typography>
                <Card sx={{ p: 3, mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="mill">Mill</InputLabel>
                                <Select
                                    id="mill"
                                    name="mill"
                                    value={formData.mill}
                                    onChange={handleFormChange}
                                >
                                    {millData?.map(item => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name} {/* Display mill ID */}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="ware_house">Warehouse</InputLabel>
                                <Select
                                    id="ware_house"
                                    name="ware_house"
                                    value={formData.ware_house}
                                    onChange={handleFormChange}
                                >
                                    {warehouseData?.map(item => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name} ({item.code})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Code"
                                name="code"
                                value={formData.code}
                                onChange={handleFormChange}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                fullWidth
                            />
                            {/* <TextField
                                label="Created By"
                                name="created_by"
                                value={formData.created_by}
                                onChange={handleFormChange}
                                fullWidth
                                disabled
                            /> */}
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Button variant="contained" color="primary" type="submit">Save</Button>
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

export default LocationForm;
