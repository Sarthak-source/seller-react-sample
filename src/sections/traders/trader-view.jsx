
import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import NetworkRepository from 'src/app-utils/network_repository';
import Scrollbar from 'src/components/scrollbar';
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
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [traderData, setTraderData] = useState([]);
    const { traderHeaderRow } = useTraderTableFormat();

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

    const handleFilterByName = (event) => {
        setPage(1);
        setFilterName(event.target.value);
    };


    const dataFiltered = applyFilter({
        inputData: traderData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Traders</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenTrader}>
                    Add Traders
                </Button>
            </Stack>
            <Card>
                <TableToolbar
                    numSelected={0}

                    filterName={filterName}
                    onFilterName={handleFilterByName}
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
                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
        </Container>
    );
}