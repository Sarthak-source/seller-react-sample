import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
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
    'code': '',
    'description': '',
    'is_active': '',
  });

  const [warehouse, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);


  useEffect(() => {
    const fetchWareHouseBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getWarehouseList();
        setWarehouseData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWareHouseBatchData();
  }, []);

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
    // Check if any required fields are empty
    if (!locationData.locationCode || !locationData.locationDesc || !locationData.locationStatus) {
      setSnackbarMessage('Please fill in all required fields to add location.');
      setSnackbarOpen(true);
      return;
    }

    // All required fields are filled, add the location
    setLocations((prevLocations) => [...prevLocations, locationData]);

    // Reset locationData to clear the input fields
    setLocationData({
      'code': '',
      'description': '',
      'is_active': '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation logic
    if (!formData.code || !formData.name || !formData.plant || !formData.type || !formData.warehouseArea || !formData.locationInPlant) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await NetworkRepository.postWarehouseBatch(
        formData.code,
        formData.name,
        formData.plant,
        formData.type,
        formData.parentWarehouseId || null, // Set to null if empty
        formData.locationInPlant,
        parseFloat(formData.warehouseArea),
        257, // Assuming created_by is always 257
        locations.map(location => ({
          code: location.locationCode,
          description: location.locationDesc,
          is_active: location.locationStatus
        }))
      );

      setSnackbarMessage('Data saved successfully');
    } catch (error) {
      setSnackbarMessage('Failed to save data');
    } finally {
      setSnackbarOpen(true);
    }
  };


  const handleCancel = () => {
    // Reset the form
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
            />
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControl fullWidth margin="normal">
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
              multiline
              rows={4}
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
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Location Code"
                name="locationCode"
                value={locationData.locationCode}
                onChange={handleLocationChange}
              />
              <TextField
                label="Location Desc"
                name="locationDesc"
                value={locationData.locationDesc}
                onChange={handleLocationChange}
              />
              <FormControl>
                <InputLabel htmlFor="locationStatus">Status</InputLabel>
                <Select
                  id="locationStatus"
                  name="locationStatus"
                  value={locationData.locationStatus}
                  onChange={handleLocationChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="InActive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={addLocation}>Add Location</Button>
            </Stack>
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
                          onClick={() => {
                            // Remove the location at the specified index from the locations array
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
