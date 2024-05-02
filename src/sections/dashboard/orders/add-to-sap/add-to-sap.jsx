import { Button, Container, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';

const SalesOrderForm = () => {
    const [formData, setFormData] = useState({
        SalesOrderType: '',
        ReferenceSDDocument: '',
        PurchaseOrderByCustomer: '',
        SalesOrderDate: '',
        to_Partner: [
            { PartnerFunction: '', Customer: '' },
            { PartnerFunction: '', Customer: '' },
            { PartnerFunction: '', Customer: '' }
        ],
        to_Item: [
            {
                SalesOrderItem: '',
                MaterialByCustomer: '',
                ReferenceSDDocument: '',
                ReferenceSDDocumentItem: '',
                RequestedQuantity: ''
            }
        ]
    });

    const handleInputChange = (e, index, type) => {
        const { name, value } = e.target;
        if (type === 'partner') {
            const newPartners = formData.to_Partner.map((partner, i) =>
                index === i ? { ...partner, [name]: value } : partner
            );
            setFormData({ ...formData, to_Partner: newPartners });
        } else if (type === 'item') {
            const newItems = formData.to_Item.map((item, i) =>
                index === i ? { ...item, [name]: value } : item
            );
            setFormData({ ...formData, to_Item: newItems });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddPartner = () => {
        setFormData({
            ...formData,
            to_Partner: [...formData.to_Partner, { PartnerFunction: '', Customer: '' }]
        });
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            to_Item: [...formData.to_Item, {
                SalesOrderItem: '',
                MaterialByCustomer: '',
                ReferenceSDDocument: '',
                ReferenceSDDocumentItem: '',
                RequestedQuantity: ''
            }]
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
                            label="Sales Order Type"
                            name="SalesOrderType"
                            value={formData.SalesOrderType}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Reference SD Document"
                            name="ReferenceSDDocument"
                            value={formData.ReferenceSDDocument}
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
                            label="Sales Order Date"
                            name="SalesOrderDate"
                            value={formData.SalesOrderDate}
                            onChange={handleInputChange}
                            variant="outlined"
                            type="date"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddPartner}>
                            Add Partner
                        </Button>
                    </Grid>
                    {formData.to_Partner.map((partner, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Partner Function ${index + 1}`}
                                    name={`to_Partner.${index}.PartnerFunction`}
                                    value={partner.PartnerFunction}
                                    onChange={(e) => handleInputChange(e, index, 'partner')}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Customer ${index + 1}`}
                                    name={`to_Partner.${index}.Customer`}
                                    value={partner.Customer}
                                    onChange={(e) => handleInputChange(e, index, 'partner')}
                                    variant="outlined"
                                />
                            </Grid>
                        </React.Fragment>
                    ))}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddItem}>
                            Add Item
                        </Button>
                    </Grid>
                    {formData.to_Item.map((item, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={`Sales Order Item ${index + 1}`}
                                    name={`to_Item.${index}.SalesOrderItem`}
                                    value={item.SalesOrderItem}
                                    onChange={(e) => handleInputChange(e, index, 'item')}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Material By Customer ${index + 1}`}
                                    name={`to_Item.${index}.MaterialByCustomer`}
                                    value={item.MaterialByCustomer}
                                    onChange={(e) => handleInputChange(e, index, 'item')}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Reference SD Document ${index + 1}`}
                                    name={`to_Item.${index}.ReferenceSDDocument`}
                                    value={item.ReferenceSDDocument}
                                    onChange={(e) => handleInputChange(e, index, 'item')}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Reference SD Document Item ${index + 1}`}
                                    name={`to_Item.${index}.ReferenceSDDocumentItem`}
                                    value={item.ReferenceSDDocumentItem}
                                    onChange={(e) => handleInputChange(e, index, 'item')}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Requested Quantity ${index + 1}`}
                                    name={`to_Item.${index}.RequestedQuantity`}
                                    value={item.RequestedQuantity}
                                    onChange={(e) => handleInputChange(e, index, 'item')}
                                    variant="outlined"
                                />
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default SalesOrderForm;
