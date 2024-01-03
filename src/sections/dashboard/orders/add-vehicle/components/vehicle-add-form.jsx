import LoadingButton from "@mui/lab/LoadingButton";
import { Checkbox, DialogActions, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
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
import NetworkRepository from "src/app-utils/network_repository";
import Iconify from "src/components/iconify";
import SelectAddressScreen from "../../order-details/components/select-address";

export default function AddVehicleForm({ orderSummary }) {
    const [quatity, setQuatity] = useState('');
    const [invoiceOrderPrefix, setInvoiceOrderPrefix] = useState('');
    const [lrNo, setLrNo] = useState('');

    const [shippingTo, setShippingTo] = useState('');
    const [billTo, setBillTo] = useState('');
    const [shippingFrom, setShippingFrom] = useState('');
    const [vehicle, setVehicle] = useState('');


    const [shippingToAddress, setShippingToAddress] = useState(null);
    const [billToAddress, setBillToAddress] = useState(null);
    const [shippingFromAddress, setShippingFromAddress] = useState(null);

    const [shippingToDialogOpen, setShippingToDialogOpen] = useState(false);
    const [billingToDialogOpen, setBillToDialogOpen] = useState(false);
    const [shippingFromDialogOpen, setShippingFromDialogOpen] = useState(false);


    const [shippingToGSTNlist, setShippingToGSTNlist] = useState([]);
    const [billingToGSTNlist, setBillToGSTNlist] = useState([]);
    const [shippingFromGSTNlist, setShippingFromGSTNlist] = useState([]);

    const [vehicleFromlist, setvehiclelist] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false)

    const [billToId, setBillID] = useState(0);

    const [selectedItemID, setSelectedItemID] = useState(orderSummary.order.flexible_products.map((flexibleProduct) => flexibleProduct.id) || []);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        if (orderSummary) {




            if (orderSummary.order.invoice_prefix) {
                setInvoiceOrderPrefix(orderSummary.order.invoice_prefix);
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
                setVehicle(orderSummary.order.e_transporter);

            }
        }
    }, [
        orderSummary,
    ])

    const handleCardClick = () => {
        setDialogOpen(true);
    };




    const handleAddressDialogClose = () => {
        setShippingToDialogOpen(false);
        setBillToDialogOpen(false)
        setShippingFromDialogOpen(false)
    };

    const handleUpdate = () => {
        console.log('Updating with values:', {

            invoiceOrderPrefix,


            shippingFrom,

        });
        setDialogOpen(false);
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

                if (e.length >= 15) {
                    setBillToDialogOpen(true)
                }
            } catch (error) {
                console.error('Error fetching GSTIN list:', error);
            }

        }
    }


    const vehicleFromList = async (e) => {
        setVehicle(e)
        if (e.length >= 2) {
            const data = await NetworkRepository.vehicleExistCheck2(e);

            console.log('vehicleFromList',data)
            setvehiclelist(data)
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
                    value={quatity}
                    onChange={(e) => setQuatity(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label="Quatity"
                    fullWidth
                />
                <Box style={{ height: 20 }} />

                <TextField
                    value={vehicle.vehicle_num}
                    onChange={(e) => vehicleFromList(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label='Vehicle'
                    fullWidth
                />

                {
                    vehicleFromlist.length > 0 && (
                        <List>
                            {vehicleFromlist.map((vehicleHere) => (
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
                                    <ListItem sx={{ width: 300 }} key={`${vehicleHere.id}`}>
                                        <ListItemAvatar>
                                            <Checkbox
                                                edge="start"
                                                disableRipple
                                                onChange={() => setVehicle(vehicleHere)}
                                                checked={vehicle === vehicleHere}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={vehicleHere.vehicle_num}
                                        />
                                    </ListItem>
                                </Card>
                            ))}
                        </List>
                    )
                }


                <Box style={{ height: 20 }} />
                <TextField
                    value={lrNo}
                    onChange={(e) => setLrNo(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    label="LR No."
                    fullWidth
                />
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
                            label='Bill GST'
                            fullWidth
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
                            label='Shipping GST'
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
                <LoadingButton
                    onClick={handleUpdate}
                    variant="contained"
                    fullWidth
                    style={{ height: '40px' }}
                >
                    Add Vehicle
                </LoadingButton>

                {/* Dialog for Invoice & E-waybill setting */}

                {address(shippingTo, shippingToDialogOpen, setShippingToAddress)}
                {address(billTo, billingToDialogOpen, setBillToAddress)}
                {address(shippingFrom, shippingFromDialogOpen, setShippingFromAddress)}
            </Box>
        </Card>
    );
}

AddVehicleForm.propTypes = {
    orderSummary: PropTypes.any,
};
