import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function WarehouseOrderForm() {
  const [order, setOrder] = useState({
    customer: '',
    date: '',
    status: '',
    total: '',
  });

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrder({
      customer: '',
      date: '',
      status: '',
      total: '',
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
          Add/Edit Order
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Customer"
                name="customer"
                value={order.customer}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={order.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                name="status"
                value={order.status}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total"
                name="total"
                type="number"
                value={order.total}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton fullWidth type="submit" size="large" variant="contained" color="primary">
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Stack>
  );
}

