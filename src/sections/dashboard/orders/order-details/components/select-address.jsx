import {
  Box,
  Button,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import AddAddress from 'src/sections/address/add-address';

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

      <AddAddress openDialog={openDialog} setOpenDialog={setOpenDialog}  />
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
