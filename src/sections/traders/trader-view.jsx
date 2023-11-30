
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
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { useRouter } from 'src/routes/hooks';
import TableEmptyRows from '../dashboard/table-empty-rows';
import SharedTableHead from '../dashboard/table-head';
import TableNoData from '../dashboard/table-no-data';
import TableToolbar from '../dashboard/table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../dashboard/utils';
import TraderTableRow from './trader-table-row/trader-table-row';
import { useTraderTableFormat } from './use-trader-table-formate';


export default function TraderView() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [traderData, setTraderData] = useState([]);
    const { traderHeaderRow } = useTraderTableFormat();
    const [loading, setLoading] = useState(true);
    const searchTerm = useSelector((state) => state.search.searchTerm);
    useEffect(() => { }, [searchTerm])

    const handleOpenTrader = () => {
        router.replace('/home/trader-create');
    };

    useEffect(() => {
        const fetchTraderData = async () => {
            try {
                const data = await NetworkRepository.sellerTraders();
                console.log('Seller traders', data);
                setTraderData(data);
            } catch (error) {
                console.error('Error fetching Trader data:', error);
            } finally {
                setLoading(false); // Set loading to false when data is fetched (whether successful or not)
            }
        };
        fetchTraderData();
    }, []);

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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Traders</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenTrader}>
                    Add Traders
                </Button>
            </Stack>

            {!loading ? (<Card>
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
                                {dataFiltered
                                    .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                    .map((row) => (
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
                                    emptyRows={emptyRows(page, rowsPerPage / 15, dataFiltered.length)}
                                />
                                {notFound && <TableNoData query={searchTerm} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <SkeletonLoader />
                </Box>
            )}
        </Container>
    );
}