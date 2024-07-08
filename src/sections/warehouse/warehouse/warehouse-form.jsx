import {
  Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

const WarehouseForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    plant: '',
    type: '',
    parentWarehouseId: '',
    warehouseArea: '',
    locationInPlant: '',
    status: '',
    
  });

  const [locations, setLocations] = useState([]);
  const [locationData, setLocationData] = useState({
    locationCode: '',
    locationDesc: '',
    locationStatus: '',
  });

  const [warehouse, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const warehouseData = useSelector((state) => state.warehouseUpdate.warehouses);

  console.log('warehouseData',warehouseData)

  const isUpdate = Object.keys(warehouseData).length !== 0;

  useEffect(() => {
    const fetchWareHouseBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getWarehouseList(formData.plant);
        setWarehouseData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWareHouseBatchData();
  }, [formData.plant]);

  useEffect(()=>{
    const fetchLocationBatchData = async () => {
      try {
        setLoading(true);
       
        const locationDataFetched = await NetworkRepository.getWarehouseLocationList(warehouseData.id);
        console.log('locationData',locationDataFetched)
        const mappedLocations = locationDataFetched.map(location => ({
          locationCode: location.code.toString(), // Assuming code is a number
          locationDesc: location.description,
          locationStatus: location.is_active ? 'Active' : 'Inactive', // Assuming is_active is a boolean
        }));
    
        // Set the mapped locations to the state
        setLocations(mappedLocations);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (warehouseData.id) {
      fetchLocationBatchData();
    }
    
  },[warehouseData])

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setLocationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addLocation = () => {
    if (!locationData.locationCode || !locationData.locationDesc || !locationData.locationStatus) {
      setSnackbarMessage('Please fill in all required fields to add location.');
      setSnackbarOpen(true);
      return;
    }

    setLocations((prevLocations) => [...prevLocations, locationData]);

    setLocationData({
      locationCode: '',
      locationDesc: '',
      locationStatus: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.code || !formData.name || !formData.plant || !formData.type || !formData.warehouseArea || !formData.locationInPlant) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isUpdate) {
        const response = await NetworkRepository.warehouseEdit({
          id: warehouseData.id,
          location: formData.locationInPlant,
          area: formData.warehouseArea,
          updated_by: selectedUserConfig.seller.user,
        });

        setSnackbarMessage('Warehouse updated successfully');
      } else {
        const response = await NetworkRepository.postWarehouseBatch(
          formData.code,
          formData.name,
          formData.plant,
          formData.type,
          formData.parentWarehouseId || null,
          formData.locationInPlant,
          parseFloat(formData.warehouseArea),
          selectedUserConfig.seller.user,
          locations.map(location => ({
            code: location.locationCode,
            description: location.locationDesc,
            is_active: location.locationStatus
          }))
        );

        setSnackbarMessage('Data saved successfully');
      }
    } catch (error) {
      setSnackbarMessage('Failed to save data');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      code: '',
      name: '',
      plant: '',
      type: '',
      parentWarehouseId: '',
      warehouseArea: '',
      locationInPlant: '',
      status: '',
    });
    setLocations([]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (isUpdate) {
      setFormData({
        code: warehouseData.code,
        name: warehouseData.name,
        plant: warehouseData.mill.pk,
        type: warehouseData.ware_house_type === 'Open' ? 'open' : 'close',
        parentWarehouseId: warehouseData.parent_ware_house,
        warehouseArea: warehouseData.area,
        locationInPlant: warehouseData.location,
        status: warehouseData.is_active === 'Active' ? 'inactive' : 'active',
      });
    }
  }, [isUpdate, warehouseData]);

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
        <Typography variant="h4" gutterBottom>Warehouse</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleFormChange}
              fullWidth
              disabled={isUpdate}
            />
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              disabled={isUpdate}
            />
            <FormControl fullWidth margin="normal" disabled={isUpdate}>
              <InputLabel htmlFor="plant">Plant</InputLabel>
              <Select
                labelId="plant"
                id="plant"
                value={formData.plant}
                label="Plant"
                name="plant"
                onChange={handleFormChange}
                required
              >
                {selectedUserConfig.seller.mills.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                disabled={isUpdate}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="parentWarehouseId">Parent Warehouse Id</InputLabel>
              <Select
                id="parentWarehouseId"
                name="parentWarehouseId"
                value={formData.parentWarehouseId}
                onChange={handleFormChange}
                disabled={isUpdate}
              >
                {warehouse.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Warehouse Area"
              name="warehouseArea"
              value={formData.warehouseArea}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Location in Plant"
              name="locationInPlant"
              value={formData.locationInPlant}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Locations</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Location Code"
                  name="locationCode"
                  disabled={isUpdate}
                  value={locationData.locationCode}
                  onChange={handleLocationChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Location Desc"
                  name="locationDesc"
                  disabled={isUpdate}
                  value={locationData.locationDesc}
                  onChange={handleLocationChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="locationStatus">Status</InputLabel>
                  <Select
                    id="locationStatus"
                    name="locationStatus"
                    disabled={isUpdate}
                    value={locationData.locationStatus}
                    onChange={handleLocationChange}
                    fullWidth
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant="contained" disabled={isUpdate} onClick={addLocation} fullWidth>Add Location</Button>
              </Grid>
            </Grid>
            <TableContainer component={Card} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sl. No</TableCell>
                    <TableCell>Location Code</TableCell>
                    <TableCell>Location Desc</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{location.locationCode}</TableCell>
                      <TableCell>{location.locationDesc}</TableCell>
                      <TableCell>{location.locationStatus}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="secondary"
                          disabled={isUpdate}
                          onClick={() => {
                            setLocations(prevLocations => prevLocations.filter((_, i) => i !== index));
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">Save</Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
          </Stack>
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
};

export default WarehouseForm;
