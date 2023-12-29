import {
  Box,
  Button,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';

export default function SelectAddressScreen({ gstIn, orderPk, billing, shipping, onSelect }) {
  const [selectedAddressId, setSelectedAddressId] = useState({});
  const [addresses, setAddresses] = useState(null);

  useEffect(() => {
    const callApi = async () => {
      const data = await NetworkRepository.addressListView(gstIn);
      setAddresses(data);
    };
    callApi();
  }, [gstIn]);

  const handleAddNewAddress = async () => {
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
        onClick={handleAddNewAddress}
        startIcon={<Iconify icon="eva:plus-fill" />}
      >
        Add New Address
      </Button>
      <Box marginTop={2}>
        {addresses === null ? (
          <Typography>No Data</Typography>
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
                  <ListItemText
                    primary={address.address}
                    secondary={`${address.location} - ${address.pin}`}
                  />
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </Box>
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
