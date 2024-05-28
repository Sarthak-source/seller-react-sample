import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import { fetchTraderData, fetchTraderDataStart } from 'src/redux/actions/traders';

const AddAddress = ({ openDialog, setOpenDialog }) => {
    const dispatch = useDispatch();
    const traders = useSelector((state) => state.traders.traderData);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const [traderData, setTraderData] = useState(traders);
    const [selectedTrader, setSelectedTrader] = useState({});

    const [nameController, setNameController] = useState('');
    const [pinController, setPinController] = useState('');
    const [addressController, setAddressController] = useState('');
    const [gstinController, setGstinController] = useState('');
    const [locationController, setLocationController] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (Array.isArray(traderData) && traderData.length === 0) {
                    dispatch(fetchTraderDataStart());
                    await dispatch(fetchTraderData(selectedUser.id));
                }
            } catch (error) {
                console.error('Error fetching trader data:', error);
            }
        };

        fetchData();
        setTraderData(traders);
    }, [dispatch, traderData, traders, selectedUser.id]);

    const handleTraderChange = (event) => {
        const trader = event.target.value;
        setSelectedTrader(trader);
    };

    const handleNameChange = (event) => {
        setNameController(event.target.value);
    };

    const handlePinChange = (event) => {
        setPinController(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddressController(event.target.value);
    };

    const handleGstinChange = (event) => {
        setGstinController(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocationController(event.target.value);
    };

    const addAddress = async () => {
        try {
            if (nameController === '') {
                showSnackbar('Please add a name.', 'error');
            } else if (Number.isNaN(Number(pinController)) || pinController.length !== 6) {
                showSnackbar('Please add a valid PIN number.', 'error');
            } else {
                const result = await NetworkRepository.addressListPost(
                    nameController,
                    gstinController,
                    pinController,
                    addressController,
                    locationController,
                    selectedTrader.id,
                );
                console.log('result', result);
                setOpenDialog(false);
                setNameController('');
                setPinController('');
                setAddressController('');
                setGstinController('');
                setLocationController('');
                showSnackbar('Address created successfully.', 'success');
            }
        } catch (error) {
            console.error('Error adding Address:', error);
            showSnackbar('Error adding address.', 'error');
        }
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setNameController('');
        setPinController('');
        setAddressController('');
        setGstinController('');
        setLocationController('');
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    const isValidGSTIN = (gstin) => {
        const gstinPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
        return gstinPattern.test(gstin);
    };

    return (
        <Dialog open={openDialog} onClose={closeDialog}>
            <DialogTitle variant="h4" mt={2} mb={1}>
                Add Address
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" sx={{ mt: 2 }}>
                    <TextField
                        name="name"
                        label="Name"
                        value={nameController}
                        onChange={handleNameChange}
                        fullWidth
                        sx={{ marginBottom: 2, marginRight: 2 }}
                    />
                    <TextField
                        name="pin"
                        label="Pin"
                        value={pinController}
                        onChange={handlePinChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                </Stack>
                <TextField
                    name="address"
                    label="Address"
                    value={addressController}
                    onChange={handleAddressChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    name="gstin"
                    label="GSTIN"
                    value={gstinController}
                    disabled={isValidGSTIN(gstinController)}
                    onChange={handleGstinChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    name="location"
                    label="Location"
                    value={locationController}
                    onChange={handleLocationChange}
                    fullWidth
                    sx={{ marginTop: 2 }}
                />
                <Select
                    labelId="select-trader-label"
                    value={selectedTrader}
                    fullWidth
                    onChange={handleTraderChange}
                    sx={{ mt: 2 }}
                    label="Select Trader"
                >
                    <MenuItem value={selectedTrader} disabled>
                        Select Mill
                    </MenuItem>

                    {traderData.map((trader) => (

                        <MenuItem key={trader.id} value={trader}>
                            {trader.name}
                        </MenuItem>
                    ))}
                </Select>

            </DialogContent>
            <DialogActions>
                <Button onClick={addAddress}>Add</Button>
                <Button onClick={closeDialog}>Cancel</Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

AddAddress.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
};

export default AddAddress;
