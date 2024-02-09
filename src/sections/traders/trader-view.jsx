import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';



import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { fetchTraderData, fetchTraderDataStart } from 'src/redux/actions/traders';
import { useRouter } from 'src/routes/hooks';
import TableEmptyRows from '../dashboard/table-empty-rows';
import SharedTableHead from '../dashboard/table-head';
import TableNoData from '../dashboard/table-no-data';
import TableToolbar from '../dashboard/table-toolbar';
import { applyFilter, getComparator } from '../dashboard/utils';
import TraderTableRow from './trader-table-row/trader-table-row';
import { useTraderTableFormat } from './use-trader-table-formate';

export default function TraderView() {
    const router = useRouter();
    const dispatch = useDispatch();
    const traders = useSelector((state) => state.traders.traderData);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [traderData, setTraderData] = useState(traders);
    const [openDialog, setOpenDialog] = useState(false);
    const [nameController, setNameController] = useState('');
    const [numberController, setNumberController] = useState('');

    const loading = useSelector((state) => state.traders.loading);
    const { traderHeaderRow } = useTraderTableFormat();
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (Array.isArray(traderData) && traderData.length === 0) {
                    dispatch(fetchTraderDataStart());
                    await dispatch(fetchTraderData(selectedUser.id));
                }
            } catch (error) {
                console.error('Error fetching trader data:', error);
            }
        };

        fetchData();
        setTraderData(traders);
    }, [dispatch, traderData, traders, selectedUser.id]);

    const handleOpenTrader = () => {
        setOpenDialog(true)
    };

    const handleNameChange = (event) => {
        setNameController(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNumberController(event.target.value);
    };

    const addTrader = async () => {
        try {
            if (nameController === '') {
                showSnackbar('Please add a name.', 'error');
            } else if (Number.isNaN(Number(numberController)) || numberController.length !== 10) {
                showSnackbar('Please add a valid number.', 'error');

            } else {
                const result = await NetworkRepository.traderPostView(nameController, numberController, selectedUser.id);
                console.log('result', result)
                setOpenDialog(false)
                setNameController('')
                setNumberController('')
                showSnackbar('Trader created successfully.', 'success');
            }
        } catch (error) {
            console.error('Error adding trader:', error);
        }
    };

    const closeDialog
        = () => {
            setOpenDialog(false)
            setNameController('')
            setNumberController('')
        }
    // Function to close the Snackbar
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

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const traderSearch = traderData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.billing_gstin && item.billing_gstin.gstin.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const dataFiltered = applyFilter({
        inputData: traderSearch,
        comparator: getComparator(order, orderBy),
    });

    const notFound = !dataFiltered.length;

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
                <Typography variant="h4" mt={2} mb={-2}>Traders</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenTrader}>
                    Add Traders
                </Button>
            </Stack>

            {!loading ? (
                <Card >
                    <TableToolbar
                        numSelected={0}
                        showIcons={false}
                        label='Search name or Phone no..'
                    />
                    <Scrollbar>
                        <TableContainer sx={{ overflow: 'unset' }}>
                            <Table sx={{ minWidth: 800 }}>
                                <SharedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    rowCount={dataFiltered.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleSort}
                                    headLabel={traderHeaderRow}
                                />
                                <TableBody>
                                    {dataFiltered.map((row) => (
                                        <TraderTableRow
                                            name={row.name}
                                            status={row.is_preferred === true ? "Active" : "Inactive"}
                                            gstno={row.billing_gstin && row.billing_gstin.gstin ? row.billing_gstin.gstin : 'Not given'}
                                            phoneNumber={row.phone_number}
                                            email={row.email}
                                            mills={row.mills}
                                        />
                                    ))}
                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={0}
                                    />
                                    {notFound && <TableNoData query={searchTerm} />}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <SkeletonLoader />
                </Box>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add Trader</DialogTitle>
                <DialogContent >
                    <TextField
                        name="remarks"
                        label="Name"
                        value={nameController}
                        onChange={handleNameChange}
                        fullWidth
                        sx={{ marginBottom: 2, marginTop: 2 }}
                    />
                    <TextField
                        name="number"
                        label="Phone number"
                        inputProps={{ maxLength: 10 }}
                        value={numberController}
                        onChange={handleNumberChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    {/* Your dialog content goes here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={addTrader}>Add</Button>
                    <Button onClick={closeDialog}>Cancel</Button>
                    {/* Additional action buttons if needed */}
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Container>

    );
}
