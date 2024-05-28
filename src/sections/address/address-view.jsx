// AddressView.js
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { useRouter } from 'src/routes/hooks';
import TableEmptyRows from '../dashboard/table-empty-rows';
import SharedTableHead from '../dashboard/table-head';
import TableNoData from '../dashboard/table-no-data';
import TableToolbar from '../dashboard/table-toolbar';
import { applyFilter, getComparator } from '../dashboard/utils';
import AddAddress from './add-address';
import AddressTableRow from './address-table-row/address-table-row';
import { useAddressTableFormat } from './use-address-table-formate';

export default function AddressView() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [addressData, setAddressData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addressHeaderRow } = useAddressTableFormat();

    const searchTerm = useSelector((state) => state.search.searchTerm);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const addressList = await NetworkRepository.getAddressList(selectedUser.id);
                setAddressData(addressList);
            } catch (error) {
                console.error('Error fetching Address data:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [dispatch, selectedUser.id]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    };

    const handleOpenAddress = () => {
        setSelectedAddress(null);
        setOpenDialog(true);
    };

    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setOpenDialog(true);
    };

    const addressSearch = addressData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gstin.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location && item.location.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const dataFiltered = applyFilter({
        inputData: addressSearch,
        comparator: getComparator(order, orderBy),
    });

    const notFound = !dataFiltered.length;

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
                <Typography variant="h4" mt={2} mb={-2}>Address</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAddress}>
                    Add Address
                </Button>
            </Stack>

            {!loading ? (
                <Card>
                    <TableToolbar numSelected={0} showIcons={false} label='Search name or Phone no..' />
                    <Scrollbar>
                        <TableContainer sx={{ overflow: 'unset' }}>
                            <Table sx={{ minWidth: 800 }}>
                                <SharedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    rowCount={dataFiltered.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleSort}
                                    headLabel={addressHeaderRow}
                                />
                                <TableBody>
                                    {dataFiltered.map((row) => (
                                        <AddressTableRow
                                            key={row.id}
                                            name={row.name}
                                            gstin={row.gstin}
                                            address={row.address}
                                            location={row.location}
                                            pin={row.pin}
                                            onEdit={() => handleEditAddress(row)}
                                        />
                                    ))}
                                    <TableEmptyRows height={77} emptyRows={0} />
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

            <AddAddress openDialog={openDialog} setOpenDialog={setOpenDialog} selectedAddress={selectedAddress} />
        </Container>
    );
}
