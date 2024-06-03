import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function WarehouseProductForm() {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
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
          Add/Edit Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                name="category"
                value={product.category}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={product.stock}
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

