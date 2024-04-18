import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify/iconify';
import Label from 'src/components/label';
import { storeSummaryState } from 'src/redux/actions/store-actions';
import { useRouter } from 'src/routes/hooks';
import { primary } from 'src/theme/palette';


function StoreHouse() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const selectedStore = useSelector((state) => state.storeState);
    const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
    const [dynamicData, setDynamicData] = useState(null);
    const [productData, setProductData] = useState(null);
    const [weighbridge, setWeighbridge] = useState(null);
    const [lotQty, setLotQty] = useState(0);
    const [millValue, setMillValue] = useState({});
    const [storeValue, setStoreValue] = useState({});
    const [millName, setMillName] = useState('');
    const [millId, setMillId] = useState('');
    const [mill, setMill] = useState([]);
    const [storeHouse, setStoreHouse] = useState([]);
    const [lot, setLot] = useState([]);
    const [lotID, setLotID] = useState('');
    const [lotName, setLotName] = useState(''); // Change from const to useState setter
    const [qtyUNIT, setQtyUNIT] = useState(''); // Change from const to useState setter
    const [lotwiseQ, setLotwiseQ] = useState([]);
    const [productTypeName, setProductTypeName] = useState(''); // Change from const to useState setter
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [product, setProduct] = useState([]);
    const [productQuantity, setProductQuantity] = useState([]);
    const [totalQuanity, setTotalQuantity] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLotEmpty, setIsLotEmpty] = useState(true);
    const [isQtyChangable, setIsQtyChangable] = useState(null);
    const [skipLoading, setSkipLoading] = useState(null);
    const [useConfigData, setUseConfigData] = useState(true);
    const [selectedQty, setSelectedQty] = useState(0);
    const [sealNumber, setSealNumber] = useState('');
    const [sealRemark, setSealRemark] = useState('');
    const [tareWeight, setTareWeight] = useState('');
    const [grossWeight, setGrossWeight] = useState('');
    const [netWeight, setNetWeight] = useState('');
    const [selectedLot, setSelectedLot] = useState([]);
    const [selectedStoreLot, setSelectedStoreLot] = useState([]);
    const [typedLot, setTypedLot] = useState({})
    const [lotExits, setLotExist] = useState(false);
    const router = useRouter();



    console.log('selectedStore', selectedStore)

    useEffect(() => {
        setLotExist(false);
        lot.forEach((currentLot, index) => {
            console.log('hoodod', lot[index].lot_pk === typedLot.lot_pk || lot[index].product_pk === typedLot.product_pk, 'lot[index].lot_pk', lot[index].lot_pk, 'typedLot.lot_pk', typedLot.lot_pk, 'lot[index].product_pk', lot[index].product_pk, 'typedLot.product_pk', typedLot);
            if (lot[index].lot_pk === typedLot.lot_pk && lot[index].product_pk === typedLot.product_pk) {
                setLotExist(true);
            }
        });
        const totalQty = lot.reduce((acc, item) => acc + item.qty, 0);
        setLotQty(totalQty);
        console.log('lot', lot, totalQty)
    }, [lot, typedLot])

    const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  

    const handleSubmit = async () => {
        if (tareWeight === '') {
            alert("Enter Tare Weight");
        } else if (grossWeight === '') {
            alert("Enter Gross Weight");
        } else if (weighbridge === null && !skipLoading) {
            alert("Add Weighbridge Photo");
        } else if (parseFloat(netWeight) <= 0 && !skipLoading) {
            alert("Net Weight Can't be 0 or Negative");
        } else if (parseFloat(netWeight) > 50000 && !skipLoading) {
            alert("Net Weight Can't be Greater than 50000");
        } else {

            const formData = {
                fromVehicleInward: selectedStore.fromVehicleInward,
                data: selectedStore.storeState,
                lot,
                qtyUNIT,
                totalQuantity: totalQuanity,
                sealRemark: sealRemark.text,
                sealNumber: sealNumber.text,
                storeData: {
                    tareWeight,
                    grossWeight,
                    netWeight,
                    image: await fileToBase64(weighbridge),
                    millId,
                    lotID,
                    lotwiseQ: selectedLot
                }
            };

            dispatch(storeSummaryState(formData));

            router.replace('/home/generate-invoice/store-house/summary');

            console.log('formData',formData);
        }
    };

    const handleDelete = async (indexToDelete) => {
        setLot(prevLot => {
            const updatedLot = [...prevLot];
            updatedLot.splice(indexToDelete, 1);
            return updatedLot;
        });
    };



    useEffect(() => {
        const userMillList = selectedUserConfig?.seller?.mills || [];
        const filteredMill = userMillList.filter(filterMill => filterMill.id === selectedStore?.storeState?.mill?.id);
        setMill(filteredMill);
    }, [selectedUserConfig?.seller?.mills, selectedStore?.storeState?.mill?.id]);

    useEffect(() => {
        if (mill[0] && mill[0].store_house) {
            console.log('store_house:', mill[0].store_house);
            setStoreHouse(mill[0].store_house);
        } else {
            console.log('store_house is undefined');
        }
    }, [mill]);

    useEffect(() => {
        setVehicleType(selectedStore.storeState.vehicle_type);
        setSkipLoading(selectedStore.storeState.mill.skip_loading_waybridge);
        selectedStore.storeState.loading_instruction.forEach((instruction, index) => {
            console.log('instruction', instruction)
            const quantity = parseFloat(instruction.qty);
            setTotalQuantity(quantity);
            setProductQuantity(prevProductQuantity => [...prevProductQuantity, quantity]);
            const { code, id } = instruction.order_head.tender_head.product;
            console.log(`Code: ${code}, ID: ${id}`);
            setProduct(prevProduct => [...prevProduct, instruction.order_head.tender_head.product]);
            setIsQtyChangable(instruction.order_head.is_qty_changable);
            setProductTypeName(prevProductTypeName => prevProductTypeName + code);
            if (index < selectedStore.storeState.loading_instruction - 1) {
                setProductTypeName(prevProductTypeName => `${prevProductTypeName}, `);
            }
        });
    }, [
        selectedStore.storeState.loading_instruction,
        selectedStore.storeState.vehicle_type,
        selectedStore.storeState.mill.id,
        selectedUserConfig.seller.mills,
        selectedStore.storeState.mill.skip_loading_waybridge,
    ])



    useEffect(() => {
        const fetchData = async () => {
            try {
                if (product.length === 1 && !useConfigData) {
                    const fetchProductData = await NetworkRepository.productData(
                        selectedStore.storeState.mill.id,
                        selectedStore.storeState.loading_instruction[0].order_head.tender_head.product.id
                    );

                    console.log('fetchProductData', fetchProductData);
                    setProductData(fetchProductData);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, [product.length, selectedStore.storeState.mill.id, selectedStore.storeState.loading_instruction, useConfigData]);




    console.log('productData', productData)

    const [selectedStorehouse, setSelectedStorehouse] = useState('');

    const handleStorehouseChange = (event) => {
        console.log('selected storehouse:', event.target.value);
        setSelectedStorehouse(event.target.value);
    };

    const handleLotChange = (event) => {
        console.log('selected storehouse:', event.target.value);
        console.log('event.target.value', event);
        setSelectedLot(event.target.value);
    };

    console.log('selectedStorehouse', selectedStorehouse)



    const handleGrossWeightChange = (event) => {
        const newGrossWeight = event.target.value;
        setGrossWeight(newGrossWeight);
        if (newGrossWeight !== '' && tareWeight !== '') {
            const newNetWeight = parseFloat(newGrossWeight) - parseFloat(tareWeight);
            setNetWeight(newNetWeight.toString());
        } else {
            setNetWeight('');
        }
    };

    const handleImageSelect = (event) => {
        const selectedImage = event.target.files[0];
        setWeighbridge(selectedImage);
    };


    console.log('totalQuanity:', lotQty === totalQuanity);
    console.log('lotQty:', lotQty);
    console.log('totalQuanity:', totalQuanity);
    console.log('selectedStore.storeState.mill.skip_loading_waybridge', selectedStore.storeState.mill.skip_loading_waybridge)



    const addLot = () => {
        if ( Number.isNaN(selectedQty) || selectedQty === 0 || selectedQty === null  ) {
            alert("Enter Lot Quantity");
            return;
        }
    
        if (selectedQty > totalQuanity) {
            alert("Enter Valid Lot Quantity");
            return;
        }
    
        if (lotQty + parseFloat(selectedQty) > totalQuanity) {
            alert(`Quantity Mismatch: Enter valid quantity, Selected Quantity: ${selectedQty}, Lot Quantity: ${lotQty}, Total Quantity: ${totalQuanity}`);
            return;
        }
        
    
        const newLot = {
            storeName: selectedStorehouse.name,
            name: selectedLot.name,
            store_pk: selectedStorehouse.id,
            lot_pk: selectedLot.id,
            qty: isQtyChangable === true ? 25.0 : parseFloat(selectedQty),
            product_pk: selectedStore.storeState.loading_instruction[0]?.order_head?.tender_head?.product?.id && `${selectedStore.storeState.loading_instruction[0].order_head.tender_head.product.id}`,
            product_name: selectedStore.storeState.loading_instruction[0]?.order_head?.tender_head?.product?.code && `${selectedStore.storeState.loading_instruction[0].order_head.tender_head.product.code}`,
        };

        
    
        const isLotExist = lot.some(l => l.lot_pk === newLot.lot_pk && l.product_pk === newLot.product_pk);
        if (isLotExist) {
            alert("Lot exists");
            return;
        }
    
        setLot([...lot, newLot]);
        setLotQty(prevLotQty => prevLotQty + newLot.qty);
    
        // Clear state variables
        setStoreValue({});
        if (useConfigData === false) {
            setStoreHouse([]);
        }
        setSelectedQty(0);
        setTypedLot({});
    
        console.log('lot', lot);
    };
    

    return (
        <>
            {!isLoading ? (
                <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Container>
            ) : (
                <Container maxWidth="xl" style={{ paddingLeft: '30px', paddingRight: '30px', marginTop: 15 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 4 }} mb={5}>
                        <Typography variant="h4">Add Storehouse</Typography>
                        <LoadingButton variant="contained" startIcon={<Iconify icon="fluent:next-frame-20-regular" />} onClick={handleSubmit}>
                            Next
                        </LoadingButton>
                    </Stack>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} >
                            <Container sx={{ mb: 4 }}>
                                <Card>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" my={2} mx={2}>
                                        <Typography variant="body2">Vehicle No :</Typography>
                                        <Label color={primary.main} sx={{ fontSize: '14px', fontWeight: 'bold' }} > {selectedStore.storeState.vehicle_num && `${selectedStore.storeState.vehicle_num}`} </Label>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" my={2} mx={2}>
                                        <Typography variant="body2">Product Type :</Typography>
                                        <Label color={primary.main} sx={{ fontSize: '14px', fontWeight: 'bold' }}> {selectedStore.storeState.loading_instruction[0]?.order_head?.tender_head?.product?.code && `${selectedStore.storeState.loading_instruction[0].order_head.tender_head.product.code}`}</Label>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" my={2} mx={2}>
                                        <Typography variant="body2">Total Qty :</Typography>
                                        <Label color={primary.main} sx={{ fontSize: '14px', fontWeight: 'bold' }}> {selectedStore.storeState.qty && selectedStore.storeState.loading_instruction[0]?.order_head?.tender_head?.product?.product_type && `${selectedStore.storeState.qty} ${selectedStore.storeState.loading_instruction[0].order_head.tender_head.product.product_type}`} </Label>
                                    </Stack>
                                </Card>
                            </Container>
                            <Container >
                                <Card>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Store</TableCell>
                                                    <TableCell>Lot</TableCell>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                    <TableCell>Delete</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {lot.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{row.storeName}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.product_name}</TableCell>
                                                        <TableCell>{row.qty}</TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={() => handleDelete(index)} color="error">
                                                                <Iconify icon="fluent:delete-12-regular" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Container>
                        </Grid>
                        <Grid item xs={12} md={6} mt={-4} >
                            <Container sx={{ padding: 4 }}>
                                {((lotQty + 1 <= totalQuanity || lotQty === 0) && skipLoading === false) ?
                                    (<Card sx={{ px: 2 }}>
                                        <Typography variant="h5" sx={{ pb: 2, pt: 2 }}>Select options</Typography>
                                        <FormControl fullWidth variant="outlined" margin="normal">
                                            <InputLabel id="storehouse-label">Storehouse</InputLabel>
                                            <Select
                                                labelId="storehouse-label"
                                                id="storehouse-select"
                                                value={selectedStorehouse}
                                                onChange={handleStorehouseChange}
                                                label="Storehouse"
                                            >
                                                {storeHouse.map(storehouse => (
                                                    <MenuItem key={storehouse.id} value={storehouse}>
                                                        {storehouse.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth variant="outlined" margin="normal">
                                            <InputLabel id="lot-label">Lot</InputLabel>
                                            <Select
                                                labelId="lot-label"
                                                id="lot-select"
                                                value={selectedLot}
                                                onChange={handleLotChange}
                                                label="Lot"
                                            >
                                                {selectedStorehouse.lot && selectedStorehouse.lot.map(l => (
                                                    <MenuItem key={l.id} value={l}>
                                                        {l.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Lot qty"
                                            value={selectedQty}
                                            onChange={(e) => setSelectedQty(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                        />
                                        <LoadingButton fullWidth size="large" loading={loading} sx={{ mt: 3, mb: 3 }}
                                            variant="contained" onClick={addLot}>Add Store house & Lot</LoadingButton>
                                    </Card>) : (
                                        <>
                                            <Card sx={{ px: 2, py: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Enter Weighbridge Details
                                                </Typography>
                                                {vehicleType === 'Tanker' && (
                                                    <>
                                                        <TextField
                                                            label="Seal Number"
                                                            value={sealNumber}
                                                            onChange={(e) => setSealNumber(e.target.value)}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="normal"
                                                        />
                                                        <TextField
                                                            label="Seal Remark"
                                                            value={sealRemark}
                                                            onChange={(e) => setSealRemark(e.target.value)}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="normal"
                                                        />
                                                    </>
                                                )}
                                                <TextField
                                                    label="Tare Weight in KG"
                                                    value={tareWeight}
                                                    onChange={(e) => setTareWeight(e.target.value)}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Gross Weight in KG"
                                                    value={grossWeight}
                                                    onChange={handleGrossWeightChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Net Weight in KG"
                                                    value={netWeight}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    disabled
                                                />
                                                <Box mt={2}>
                                                    {grossWeight !== '' && tareWeight !== '' && parseFloat(grossWeight) < parseFloat(tareWeight) && (
                                                        <Typography variant="body2" color="error">
                                                            Tare weight is greater than gross weight.
                                                        </Typography>
                                                    )}
                                                    {weighbridge === null && (
                                                        <>
                                                            <Typography variant="body2" color="textSecondary">
                                                                *Select WeighBridge Image From  Gallery
                                                            </Typography>
                                                            <label htmlFor="image-input">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleImageSelect}
                                                                    style={{ display: 'none' }}
                                                                    id="image-input"
                                                                />
                                                                <Button sx={{ mt: 2 }} component="span" variant="outlined">
                                                                    Select Image
                                                                </Button>
                                                            </label>
                                                        </>
                                                    )}
                                                    {weighbridge !== null && (
                                                        <img src={URL.createObjectURL(weighbridge)} alt="Weighbridge" style={{ width: 200, marginTop: '10px' }} />
                                                    )}
                                                </Box>
                                            </Card>
                                        </>
                                    )
                                }
                            </Container>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    );
}



export default StoreHouse;
