import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Checkbox, DialogActions, IconButton, List, ListItem, ListItemAvatar, ListItemText, Snackbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NetworkRepository from "src/app-utils/network_repository";
import Iconify from "src/components/iconify";
import InvoiceEwaybillSetting from "./invoice-ewaybill-settings";
import SelectAddressScreen from "./select-address";

export default function OrderUpdateForm({ orderSummary }) {
    const [poNumber, setPoNumber] = useState('');
    const [invoiceOrderPrefix, setInvoiceOrderPrefix] = useState('');
    const [lutNo, setLutNo] = useState('');
    const [remark, setRemark] = useState('');


    const [loading, setLoading] = useState('');

    const [shippingTo, setShippingTo] = useState('');
    const [billTo, setBillTo] = useState('');
    const [shippingFrom, setShippingFrom] = useState('');
    const [eTransport, setTransport] = useState('');


    const [shippingToAddress, setShippingToAddress] = useState(null);
    const [billToAddress, setBillToAddress] = useState(null);
    const [shippingFromAddress, setShippingFromAddress] = useState(null);
    const [eTransportAddress, setETransportAddress] = useState(null);



    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isProductDialogOpen, seProductDialogOpen] = useState(false);


    const [shippingToDialogOpen, setShippingToDialogOpen] = useState(false);
    const [billingToDialogOpen, setBillToDialogOpen] = useState(false);
    const [shippingFromDialogOpen, setShippingFromDialogOpen] = useState(false);


    const [shippingToGSTNlist, setShippingToGSTNlist] = useState([]);
    const [billingToGSTNlist, setBillToGSTNlist] = useState([]);
    const [shippingFromGSTNlist, setShippingFromGSTNlist] = useState([]);

    const [eTransportFromGSTNlist, setETransportGSTNlist] = useState([]);

    const [selectedItemID, setSelectedItemID] = useState(orderSummary.order.flexible_products.map((flexibleProduct) => flexibleProduct.id) || []);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    const nav = () => {
        setTimeout(() => {
            navigate(`/home/`);
        }, 2000);
    };

    useEffect(() => {
        if (orderSummary) {


            if (orderSummary.order.purchaseorder_num) {
                setPoNumber(orderSummary.order.purchaseorder_num);
            }
            if (orderSummary.order.lut_num) {
                setLutNo(orderSummary.order.lut_num);
            }
            if (orderSummary.order.invoice_prefix) {
                setInvoiceOrderPrefix(orderSummary.order.invoice_prefix);
            }
            if (orderSummary.orderSeller.remark) {
                setRemark(orderSummary.orderSeller.remark);
            }
            if (orderSummary.orderSeller.remark) {
                setRemark(orderSummary.orderSeller.remark);
            }
            if (orderSummary.order.shipping_address) {
                setShippingTo(orderSummary.order.shipping_address.gstin);
                setShippingToAddress(orderSummary.order.shipping_address)
            }

            if (orderSummary.order.shipping_from) {
                setShippingFrom(orderSummary.order.shipping_from.gstin);
                setShippingFromAddress(orderSummary.order.shipping_from);
            }
            if (orderSummary.order.billing_address) {
                setBillTo(orderSummary.order.billing_address.gstin);
                setBillToAddress(orderSummary.order.billing_address);
            }
            if (orderSummary.order.e_transporter) {
                setTransport(orderSummary.order.e_transporter.gstn_num.gstin);
                setETransportAddress(orderSummary.order.e_transporter);
            }

        }
    }, [
        orderSummary,
    ])


    const handleCardClick = () => {
        setDialogOpen(true);
    };

    const handleProductCardClick = () => {
        seProductDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleProductDialogClose = () => {
        seProductDialogOpen(false);
    };


    const handleAddressDialogClose = () => {
        setShippingToDialogOpen(false);
        setBillToDialogOpen(false)
        setShippingFromDialogOpen(false)
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            // Check if any required values are null or undefined
            if (!poNumber || !invoiceOrderPrefix || !lutNo || !remark || !shippingFromAddress || !orderSummary.order.id || !eTransportAddress) {
                alert('Missing required values for update');
                // Handle the case where required values are missing, such as displaying an error message to the user
                return;
            }

            console.log('Updating with values:', {
                poNumber,
                invoiceOrderPrefix,
                lutNo,
                remark,
                shippingFromAddress: shippingFromAddress.id,
                orderId: orderSummary.order.id,
                eTransportAddress,
                uo: '00sdsd'
            });

            // Make the network request asynchronously
            const data = await NetworkRepository.updateOrderDetails2(
                orderSummary.order.id,
                poNumber,
                invoiceOrderPrefix,
                lutNo,
                remark,
                eTransportAddress.id
            );

            showSnackbar('Order updated successfully.', 'success');
            nav();

            console.log('Update successful:', data);
        } catch (error) {
            console.error('Error updating order:', error);
            // Handle the error, such as displaying an error message to the user
        } finally {
            // Ensure that the dialog is closed regardless of success or failure
            setLoading(false);
            setDialogOpen(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    const handleProductSelection = (product) => {
        const productId = product.id;
        if (selectedItemID.includes(productId)) {
            setSelectedItemID(selectedItemID.filter((selectedId) => selectedId !== productId));
        } else {
            setSelectedItemID([...selectedItemID, productId]);
        }
    };

    const shippingToGstn = async (e) => {
        setShippingTo(e);
        if (e.length >= 3) {
            const data = await NetworkRepository.gstinListView(e);
            setShippingToGSTNlist(data)
            try {
                console.log('asdasdsadsad', data);
                if (e.length >= 15) {
                    setShippingToDialogOpen(true)
                }
            } catch (error) {
                console.error('Error fetching GSTIN list:', error);
            }

        }
    };

    const billToGstn = async (e) => {
        setBillTo(e)
        if (e.length >= 3) {
            const data = await NetworkRepository.gstinListView(e);
            setBillToGSTNlist(data)
            try {
                console.log('asdasdsadsad', data);
                if (e.length >= 15) {
                    setBillToDialogOpen(true)
                }
            } catch (error) {
                console.error('Error fetching GSTIN list:', error);
            }

        }
    }


    const eTransportFromGstn = async (e) => {
        setTransport(e)
        if (e.length >= 3) {
            const data = await NetworkRepository.transporterGstinListView(e);
            setETransportGSTNlist(data)
        }
    }


    const shippingFromGstn = async (e) => {
        setShippingFrom(e)
        if (e.length >= 3) {
            const data = await NetworkRepository.gstinListView(e);
            setShippingFromGSTNlist(data)
            try {

                if (e.length >= 15) {
                    setShippingFromDialogOpen(true)
                }
            } catch (error) {
                console.error('Error fetching GSTIN list:', error);
            }

        }
    }

    const transportEdit = async (e) => {
        console.log(e)
        setETransportAddress(e)
    }

    const address = (gstIn, isAddressDialogOpen, onSelect) => (
        (
            <Dialog open={isAddressDialogOpen} onClose={handleAddressDialogClose}>
                <DialogTitle>Select address</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <SelectAddressScreen gstIn={gstIn} onSelect={onSelect} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <LoadingButton onClick={handleAddressDialogClose}>
                        Submit
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        )
    )

    return (
        <Card>
            <Box p={2}>
                <TextField
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label="PO Number"
                    fullWidth
                />
                <Box style={{ height: 20 }} />
                <TextField
                    value={invoiceOrderPrefix}
                    onChange={(e) => setInvoiceOrderPrefix(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label="Invoice order prefix"
                    fullWidth
                />
                <Box style={{ height: 20 }} />
                <TextField
                    value={lutNo}
                    onChange={(e) => setLutNo(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label="Lut No."
                    fullWidth
                />
                <Box style={{ height: 20 }} />
                <TextField
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label="Remark"
                    fullWidth
                />
                <Box style={{ height: 20 }} />
                {shippingToAddress !== null ? (
                    <Card>
                        <Box>
                            <Typography style={{ fontSize: '12px', marginLeft: 15, marginTop: 5 }}>Shipping to</Typography>
                            <Box display="flex" justifyContent="space-between" paddingY={0.4} paddingX={2}>
                                {shippingToAddress.address}
                                <IconButton onClick={() => setShippingToAddress(null)} >
                                    <Iconify icon="basil:edit-outline" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Card>
                ) : (
                    <>
                        <TextField
                            value={shippingTo}
                            onChange={(e) => shippingToGstn(e.target.value)}
                            variant="outlined"
                            margin="dense"
                            label='Shipping to'
                            inputProps={{ maxLength: 15 }}
                            fullWidth
                        />
                        {
                            shippingToGSTNlist.length > 0 && (
                                <List >
                                    {shippingToGSTNlist.map((gstIn) => (
                                        <Card
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderRadius = '8px';
                                                e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderRadius = '8px';
                                                e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                                            }}
                                            sx={{ mb: 1.5 }}
                                        >
                                            <ListItem sx={{ width: 300 }} key={`${gstIn.id}`}>
                                                <ListItemAvatar>
                                                    <Checkbox
                                                        edge="start"
                                                        disableRipple
                                                        onChange={() => shippingToGstn(gstIn.gstin)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={gstIn.gstin}
                                                />
                                            </ListItem>
                                        </Card>
                                    ))}
                                </List>
                            )
                        }
                    </>
                )}



                <Box style={{ height: 20 }} />


                {billToAddress !== null ? (
                    <Card>
                        <Box>
                            <Typography style={{ fontSize: '12px', marginLeft: 15, marginTop: 5 }}>Billing to</Typography>
                            <Box display="flex" justifyContent="space-between" paddingY={0.4} paddingX={2}>
                                {billToAddress.address}
                                <IconButton onClick={() => setBillToAddress(null)} >
                                    <Iconify icon="basil:edit-outline" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Card>
                ) : (
                    <>

                        <TextField
                            value={billTo}
                            onChange={(e) => billToGstn(e.target.value)}
                            variant="outlined"
                            margin="dense"
                            label='Bill to'
                            fullWidth
                            inputProps={{ maxLength: 15 }}
                        />

                        {
                            billingToGSTNlist.length > 0 && (
                                <List >
                                    {billingToGSTNlist.map((gstIn) => (
                                        <Card
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderRadius = '8px';
                                                e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderRadius = '8px';
                                                e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                                            }}
                                            sx={{ mb: 1.5 }}
                                        >
                                            <ListItem sx={{ width: 300 }} key={`${gstIn.id}`}>
                                                <ListItemAvatar>
                                                    <Checkbox
                                                        edge="start"
                                                        disableRipple
                                                        onChange={() => billToGstn(gstIn.gstin)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={gstIn.gstin}
                                                />
                                            </ListItem>
                                        </Card>
                                    ))}
                                </List>
                            )
                        }
                    </>
                )}
                <Box style={{ height: 20 }} />
                {shippingFromAddress !== null ? (
                    <Card>
                        <Box>
                            <Typography style={{ fontSize: '12px', marginLeft: 15, marginTop: 5 }}>Shipping from</Typography>
                            <Box display="flex" justifyContent="space-between" paddingY={0.4} paddingX={2}>
                                {shippingFromAddress.address}
                                <IconButton onClick={() => setShippingFromAddress(null)} >
                                    <Iconify icon="basil:edit-outline" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Card>
                ) : (
                    <>
                        <TextField
                            value={shippingFrom}
                            onChange={(e) => shippingFromGstn(e.target.value)}
                            variant="outlined"
                            margin="dense"
                            label='Shipping From'
                            fullWidth
                            inputProps={{ maxLength: 15 }}
                        />
                        {
                            shippingFromGSTNlist.length > 0 && (
                                <List>
                                    {shippingFromGSTNlist.map((gstIn) => (
                                        <Card
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderRadius = '8px';
                                                e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderRadius = '8px';
                                                e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                                            }}
                                            sx={{ mb: 1.5 }}
                                        >
                                            <ListItem sx={{ width: 300 }} key={`${gstIn.id}`}>
                                                <ListItemAvatar>
                                                    <Checkbox
                                                        edge="start"
                                                        disableRipple
                                                        onChange={() => shippingFromGstn(gstIn.gstin)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={gstIn.gstin}
                                                />
                                            </ListItem>
                                        </Card>
                                    ))}
                                </List>
                            )
                        }
                    </>
                )}
                <Box style={{ height: 20 }} />

                <>
                    {eTransportAddress !== null ? (
                        <Card>
                            <Box>
                                <Typography style={{ fontSize: '12px', marginLeft: 15, marginTop: 5 }}>E transport</Typography>
                                <Box display="flex" justifyContent="space-between" paddingY={0.4} paddingX={2}>
                                    {eTransportAddress.name}
                                    <IconButton onClick={() => setETransportAddress(null)} >
                                        <Iconify icon="basil:edit-outline" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Card>
                    ) : (
                        <TextField
                            value={eTransport}
                            onChange={(e) => eTransportFromGstn(e.target.value)}
                            variant="outlined"
                            margin="dense"
                            label='E-transporter'
                            fullWidth
                            inputProps={{ maxLength: 15 }}
                        />
                    )}
                    {
                        eTransportFromGSTNlist.length > 0 && (eTransportAddress === null) && (
                            <List>
                                {eTransportFromGSTNlist.map((gstIn) => (
                                    <Card
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderRadius = '8px';
                                            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderRadius = '8px';
                                            e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                                        }}
                                        sx={{ mb: 1.5 }}
                                    >
                                        <ListItem sx={{ width: 300 }} key={`${gstIn.id}`}>
                                            <ListItemAvatar>
                                                <Checkbox
                                                    edge="start"
                                                    disableRipple
                                                    checked={eTransportAddress === gstIn}
                                                    onChange={() => transportEdit(gstIn)}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={gstIn.gstn_num.gstin}
                                            />
                                        </ListItem>
                                    </Card>
                                ))}
                            </List>
                        )
                    }
                </>
                <Box style={{ height: 20 }} />
                <Card onClick={handleCardClick}>
                    <Box display="flex" justifyContent="space-between" paddingY={2} paddingX={1}>
                        Update Invoice & E-waybill setting
                        <Iconify icon="eva:menu-2-fill" />
                    </Box>
                </Card>
                <Box style={{ height: 20 }} />
                <Card onClick={handleProductCardClick}>
                    <Box display="flex" justifyContent="space-between" paddingY={2} paddingX={1}>
                        Make Order Flexible
                        <Iconify icon="eva:menu-2-fill" />
                    </Box>
                </Card>
                <Box style={{ height: 20 }} />
                <LoadingButton
                    onClick={handleUpdate}
                    variant="contained"
                    fullWidth
                    loading={loading}
                    style={{ height: '40px' }}
                >
                    Update
                </LoadingButton>

                {/* Dialog for Invoice & E-waybill setting */}
                <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Invoice & E-waybill Setting</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <InvoiceEwaybillSetting orderSummary={orderSummary} />
                        </DialogContentText>
                    </DialogContent>

                </Dialog>

                {address(shippingTo, shippingToDialogOpen, setShippingToAddress)}
                {address(billTo, billingToDialogOpen, setBillToAddress)}
                {address(shippingFrom, shippingFromDialogOpen, setShippingFromAddress)}



                <Dialog open={isProductDialogOpen} onClose={handleProductDialogClose} >
                    <DialogTitle>Select Product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {
                                selectedUser.products.length > 0 && (
                                    <List sx={{ pl: 2, pr: 2, pb: 1 }}>
                                        {selectedUser.products.map((product) => (
                                            <Card
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderRadius = '8px';
                                                    e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderRadius = '8px';
                                                    e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                                                }}
                                                sx={{ mb: 1.5 }}
                                            >
                                                <ListItem sx={{ width: 300 }} key={`${product.id}`}>
                                                    <ListItemAvatar>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={selectedItemID.includes(product.id)}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            onChange={() => handleProductSelection(product)}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={product.product_type}
                                                    />
                                                </ListItem>
                                            </Card>
                                        ))}
                                    </List>
                                )
                            }
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
}

OrderUpdateForm.propTypes = {
    orderSummary: PropTypes.any,
};
