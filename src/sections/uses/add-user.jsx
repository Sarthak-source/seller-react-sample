import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

const UserForm = () => {
  const [name, setName] = useState('');
  const [sellerType, setSellerType] = useState('');
  const [sellerRole, setSellerRole] = useState([]);
  const [mills, setMills] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [products, setProducts] = useState([]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSellerTypeChange = (event) => {
    setSellerType(event.target.value);
  };

  const handleSellerRoleChange = (event) => {
    setSellerRole(event.target.value);
  };

  const handleMillsChange = (event) => {
    setMills(event.target.value);
  };


  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };



  const handleProductsChange = (event) => {
    setProducts(event.target.value);
  };

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();

    const formData = {
      name,
      seller_type: sellerType,
      seller_role: sellerRole,
      mills,
      phone_number: phoneNumber,
      seller: selectedUser.id,
      products,
    };

    console.log(formData);

    try {
      await NetworkRepository.postUserData(
        formData.name,
        formData.seller_type,
        formData.seller_role,
        formData.mills,
        formData.phone_number,
        formData.seller,
        formData.products
      );
      alert('Data submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data');
    } finally {
      // Optionally reset form or perform other actions
      console.log('Submission attempt finished');
      setLoading(false)
    }
  };


  useEffect(() => {
    const fetchUserDropDownDetails = async () => {
      setLoading(true);
      try {
        const userDropDownDetails = await NetworkRepository.getUserDropdownDetails(selectedUser.id);
        setData(userDropDownDetails);
      } catch (error) {
        console.error('Error fetching user dropdown details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDropDownDetails();
  }, [selectedUser]);

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>
      <Card
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';

        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
        }}
        sx={{
          p: 5,
          width: 1,
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" sx={{ pb: 2 }}>Add seller</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={handleNameChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            {data && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Seller Type</InputLabel>
                    <Select value={sellerType} onChange={handleSellerTypeChange} label="Seller Type">
                      {data.seller_types.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.seller_type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Seller Role</InputLabel>
                    <Select
                      multiple
                      value={sellerRole}
                      onChange={handleSellerRoleChange}
                      input={<OutlinedInput label="Seller Role" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {data.seller_types.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          <Checkbox checked={sellerRole.indexOf(role.id) > -1} />
                          <ListItemText primary={role.seller_type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Mills</InputLabel>
                    <Select
                      multiple
                      value={mills}
                      onChange={handleMillsChange}
                      input={<OutlinedInput label="Mills" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {data.mills.map((mill) => (
                        <MenuItem key={mill.id} value={mill.id}>
                          <Checkbox checked={mills.indexOf(mill.id) > -1} />
                          <ListItemText primary={mill.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Products</InputLabel>
                    <Select
                      multiple
                      value={products}
                      onChange={handleProductsChange}
                      input={<OutlinedInput label="Products" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {data.products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          <Checkbox checked={products.indexOf(product.id) > -1} />
                          <ListItemText primary={product.product_type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <LoadingButton loading={loading} fullWidth type="submit" variant="contained" color="primary">
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Stack>
  );
};

export default UserForm;
