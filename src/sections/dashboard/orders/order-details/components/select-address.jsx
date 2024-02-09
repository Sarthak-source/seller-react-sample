import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';

export default function SelectAddressScreen({ gstIn, orderPk, billing, shipping, onSelect }) {
  const [selectedAddressId, setSelectedAddressId] = useState({});
  const [addresses, setAddresses] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);


  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [pin, setPin] = useState(null);
  const [addressTyped, setAddress] = useState(null);


  const closeDialog = () => {
    setOpenDialog(false)
    setName('')
    setLocation('')
    setPin('')
    setAddress('')
  };


  useEffect(() => {
    try {
      const callApi = async () => {
        const data = await NetworkRepository.addressListView(gstIn);
        setAddresses(data);
      };
      callApi();

    } catch (error) {
      console.error('Error fetching address list view', error);
    }

  }, [gstIn]);

  const handleAddNewAddress = async () => {

    if (billing) {
      console.log(billing)
    } else if (shipping) {
      console.log(shipping)
    } else {
      console.log('none')
    }
    // Implement the logic to add a new address
  };

  const handleAddressChange = (id) => {
    setSelectedAddressId(id);
    // Call the onSelect function with the selected address ID
    onSelect(id);
  };

  return (
    <Box padding={2}>
      <Button
        onClick={() => setOpenDialog(true)}
        startIcon={<Iconify icon="eva:plus-fill" />}
      >
        Add New Address
      </Button>
      <Box marginTop={2}>
        {addresses === null ? (
          <Box width='400px'>
            <SkeletonLoader marginTop='10px' />
          </Box>

        ) : (
          <List>
            {addresses.map((address) => (
              <Card key={address.id} sx={{ marginBottom: 1 }}>
                <ListItem
                  button
                  onClick={() => handleAddressChange(address)}
                >
                  <ListItemAvatar>
                    <Checkbox
                      edge="start"
                      checked={selectedAddressId === address}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemAvatar>

                  <Stack >
                    <Typography variant="body1" fontWeight="bold">
                      {address.name}
                    </Typography>
                    <ListItemText

                      primary={address.address}
                      secondary={`${address.location} - ${address.pin}`}

                    />
                  </Stack>


                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add address</DialogTitle>
        <DialogContent >
          <TextField
            name="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            name="location"
            label="Location"

            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="pin"
            label="Pin"
            inputProps={{ maxLength: 6 }}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            name="address"
            label="Enter address"
            inputProps={{ maxLength: 6 }}
            multiline
            rows={4}
            value={addressTyped}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth

            sx={{ marginBottom: 2 }}
          />
          {/* Your dialog content goes here */}
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleAddNewAddress}>Add</LoadingButton>
          <LoadingButton onClick={closeDialog}>Cancel</LoadingButton>
          {/* Additional action buttons if needed */}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

SelectAddressScreen.propTypes = {
  gstIn: PropTypes.any,
  orderPk: PropTypes.any,
  billing: PropTypes.any,
  shipping: PropTypes.any,
  onSelect: PropTypes.any,
};
