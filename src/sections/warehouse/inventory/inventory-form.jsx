import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function WarehouseInventoryForm() {
  const [item, setItem] = useState({
    product: '',
    location: '',
    quantity: '',
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setItem({
      product: '',
      location: '',
      quantity: '',
    });
  };

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
        <Typography variant="h6" gutterBottom>
          Add/Edit Inventory
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product"
                name="product"
                value={item.product}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={item.location}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton fullWidth size="large" variant="contained" type="submit" color="primary">
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </form>


      </Card>
    </Stack>

  );
}

