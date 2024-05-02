import { Button, Container, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';

const SalesContractForm = () => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    SalesContractType: '',
    SalesOrganization: '',
    DistributionChannel: '',
    OrganizationDivision: '',
    SalesGroup: '',
    SalesOffice: '',
    SalesDistrict: '',
    SoldToParty: '',
    PurchaseOrderByCustomer: '',
    SalesContractValidityStartDate: today,
    SalesContractValidityEndDate: today,
    PricingDate: today,
    SalesContractDate: today,
    to_Item: [],
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.includes('to_Item')) {
      const newItem = { ...formData.to_Item[index], [name.split('.')[1]]: value };
      const newItems = [...formData.to_Item.slice(0, index), newItem, ...formData.to_Item.slice(index + 1)];
      setFormData({ ...formData, to_Item: newItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      to_Item: [...formData.to_Item, {
        SalesContractItem: '',
        SalesContractItemCategory: '',
        SalesContractItemText: '',
        Material: '',
        MaterialDescription: '',
        MaterialGroup: '',
        Plant: '',
        StorageLocation: '',
        ItemDeliveryDate: '',
        Quantity: '',
        UnitOfMeasure: '',
        Currency: '',
        UnitPrice: '',
        to_PricingElement: [{ ConditionType: '', ConditionRateValue: '' }],
      }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Contract Type"
              name="SalesContractType"
              value={formData.SalesContractType}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Organization"
              name="SalesOrganization"
              value={formData.SalesOrganization}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Distribution Channel"
              name="DistributionChannel"
              value={formData.DistributionChannel}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Organization Division"
              name="OrganizationDivision"
              value={formData.OrganizationDivision}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Group"
              name="SalesGroup"
              value={formData.SalesGroup}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Office"
              name="SalesOffice"
              value={formData.SalesOffice}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales District"
              name="SalesDistrict"
              value={formData.SalesDistrict}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sold To Party"
              name="SoldToParty"
              value={formData.SoldToParty}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Order By Customer"
              name="PurchaseOrderByCustomer"
              value={formData.PurchaseOrderByCustomer}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Contract Validity Start Date"
              name="SalesContractValidityStartDate"
              value={formData.SalesContractValidityStartDate}
              onChange={handleInputChange}
              variant="outlined"
              type="date"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Contract Validity End Date"
              name="SalesContractValidityEndDate"
              value={formData.SalesContractValidityEndDate}
              onChange={handleInputChange}
              variant="outlined"
              type="date"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pricing Date"
              name="PricingDate"
              value={formData.PricingDate}
              onChange={handleInputChange}
              variant="outlined"
              type="date"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sales Contract Date"
              name="SalesContractDate"
              value={formData.SalesContractDate}
              onChange={handleInputChange}
              variant="outlined"
              type="date"
            />
          </Grid>

          {formData.to_Item.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`Sales Contract Item ${index + 1}`}
                  name={`to_Item.${index}.SalesContractItem`}
                  value={item.SalesContractItem}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Sales Contract Item Category ${index + 1}`}
                  name={`to_Item.${index}.SalesContractItemCategory`}
                  value={item.SalesContractItemCategory}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Sales Contract Item Text ${index + 1}`}
                  name={`to_Item.${index}.SalesContractItemText`}
                  value={item.SalesContractItemText}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Material ${index + 1}`}
                  name={`to_Item.${index}.Material`}
                  value={item.Material}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Material Description ${index + 1}`}
                  name={`to_Item.${index}.MaterialDescription`}
                  value={item.MaterialDescription}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Material Group ${index + 1}`}
                  name={`to_Item.${index}.MaterialGroup`}
                  value={item.MaterialGroup}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Plant ${index + 1}`}
                  name={`to_Item.${index}.Plant`}
                  value={item.Plant}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Storage Location ${index + 1}`}
                  name={`to_Item.${index}.StorageLocation`}
                  value={item.StorageLocation}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Item Delivery Date ${index + 1}`}
                  name={`to_Item.${index}.ItemDeliveryDate`}
                  value={item.ItemDeliveryDate}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                  type="date"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Quantity ${index + 1}`}
                  name={`to_Item.${index}.Quantity`}
                  value={item.Quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Unit Of Measure ${index + 1}`}
                  name={`to_Item.${index}.UnitOfMeasure`}
                  value={item.UnitOfMeasure}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Currency ${index + 1}`}
                  name={`to_Item.${index}.Currency`}
                  value={item.Currency}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Unit Price ${index + 1}`}
                  name={`to_Item.${index}.UnitPrice`}
                  value={item.UnitPrice}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              {/* Add more fields for each item as needed */}
            </React.Fragment>
          ))}
        </Grid>
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default SalesContractForm;
