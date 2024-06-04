import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

export default function UpdateTraderForm() {
  const currentState = useSelector((state) => state.traders.updateTraderData);
  const [loading, setLoading] = useState(false); // New state variable for loading state


  const initialData = {
    bank_file: "",
    pan_file: "",
    gst_file: "",
    address_file: "",
    trader_id: "",
    trader_name: "",
    gstin: "",
    city: "kdp",
    address: "",
    email: "",
    pin: ""
  };

  const [formData, setFormData] = useState(initialData);
  const [filePreviews, setFilePreviews] = useState({
    bank_file: null,
    pan_file: null,
    gst_file: null,
    address_file: null,
  });

  useEffect(() => {
    if (currentState) {
      setFormData({
        bank_file: currentState.bank_file || "",
        pan_file: currentState.pan_file || "",
        gst_file: currentState.gst_file || "",
        address_file: currentState.address_file || "",
        trader_id: currentState.id || 176,
        gstin: currentState.billing_gstin.gstin || "",
        trader_name: currentState.name || "",
        city: currentState.city || "kdp",
        address: currentState.address || "",
        email: currentState.email || "",
        pin: currentState.pin || ""
      });

      // Set filePreviews directly for testing purposes
      setFilePreviews({
        bank_file: currentState.bank_file,
        pan_file: currentState.pan_file,
        gst_file: currentState.gst_file,
        address_file: currentState.address_file
      });
    }
  }, [currentState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        [name]: file,
      });
      setFilePreviews({
        ...filePreviews,
        [name]: previewUrl,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      console.log(formData);

      const response = await NetworkRepository.updateTraderData(
        formData.trader_id,
        formData.trader_name,
        formData.gstin,
        formData.city,
        formData.address,
        formData.email,
        formData.pin,
        formData.bank_file,
        formData.pan_file,
        formData.gst_file,
        formData.address_file
      );

      // You can add further handling here based on the response
    } catch (error) {
      // Handle errors here
      console.error('Error occurred while updating trader data:', error);
    } finally {
      setLoading(false); // Set loading back to false regardless of success or failure
    }
  };


  const isValidGSTIN = (gstin) => {
    const gstinPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
    return gstinPattern.test(gstin);
  };

  console.log('currentState', currentState)

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
        <Container>
          <Typography variant="h4" gutterBottom mb={3}>
            Update Trader
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Trader name"
                  name="trader_name"
                  variant="outlined"
                  fullWidth
                  value={formData.trader_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="city"
                  variant="outlined"
                  fullWidth
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="GSTIN"
                  name="gstin"
                  variant="outlined"
                  disabled={isValidGSTIN(formData.gstin)}
                  fullWidth
                  value={formData.gstin}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  name="address"
                  variant="outlined"
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="PIN"
                  name="pin"
                  variant="outlined"
                  fullWidth
                  value={formData.pin}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    cursor: 'pointer',
                    height: 56,
                  }}
                >
                  {filePreviews.bank_file ? "Change Bank File" : "Upload Bank File"}

                  <input
                    type="file"
                    name="bank_file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
                {filePreviews.bank_file && (
                  <Box mt={2}>
                    <img src={filePreviews.bank_file} alt="Bank File" style={{ maxWidth: '100%' }} />
                    {!filePreviews.bank_file && <Alert severity="error">Address file not found</Alert>}

                  </Box>

                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    cursor: 'pointer',
                    height: 56,
                  }}
                >
                  {filePreviews.pan_file ? "Change PAN File" : "Upload PAN File"}
                  <input
                    type="file"
                    name="pan_file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
                {filePreviews.pan_file && (
                  <Box mt={2}>
                    <img src={filePreviews.pan_file} alt="PAN File" style={{ maxWidth: '100%' }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    cursor: 'pointer',
                    height: 56,
                  }}
                >
                  {filePreviews.gst_file ? "Change GST File" : "Upload GST File"}
                  <input
                    type="file"
                    name="gst_file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
                {filePreviews.gst_file && (
                  <Box mt={2}>
                    <img src={filePreviews.gst_file} alt="GST File" style={{ maxWidth: '100%' }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    cursor: 'pointer',
                    height: 56,
                  }}
                >
                  {filePreviews.address_file ? "Change Address File" : "Upload Address File"}
                  <input
                    type="file"
                    name="address_file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
                {filePreviews.address_file && (
                  <Box mt={2}>
                    <img src={filePreviews.address_file} alt="Address File" style={{ maxWidth: '100%' }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <LoadingButton loading={loading} variant="contained" color="primary" type="submit" fullWidth>
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Card>
    </Stack>
  );
}
