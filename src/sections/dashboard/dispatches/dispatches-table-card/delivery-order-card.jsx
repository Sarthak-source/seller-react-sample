
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';

import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import NetworkRepository from '../../../../app-utils/network_repository'; // Adjust the path
import TableEmptyRows from '../../table-empty-rows';
import SharedTableHead from '../../table-head';
import TableNoData from '../../table-no-data';
import DoOrderTableRow from '../dispatches-table-row/delivery-order-table-row';

import TableToolbar from '../../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../../utils';
import { useDispatchesTableFormat } from '../use-dispatches-table-formate';

export default function DeliveryOrderCard() {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [dispatchesData, setDispatchesData] = useState([]);
    const { deliveryOrderHeaderRow } = useDispatchesTableFormat();
    const [loading, setLoading] = useState(true);
    const selectedMill = useSelector((state) => state.mill.selectedMill);
    const searchTerm = useSelector((state) => state.search.searchTerm);

    useEffect(() => {
        setDispatchesData([])
    }, [searchTerm])

    useEffect(() => {
        setPage(1)
        setDispatchesData([])
    }, [selectedMill])

    const fetchDispatchesData = async (dispatchesPage, text, millId) => {
        try {
            setLoading(true);
            const data = await NetworkRepository.deliveryOrders(dispatchesPage, text, millId);
            console.log('here', data.results)
            setDispatchesData(prevData => [...prevData, ...data.results]);
        } catch (error) {
            console.error('Error fetching Dispatches data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispatchesData(page, searchTerm, selectedMill.id);
    }, [page, selectedMill, searchTerm]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        if (newRowsPerPage === 15 || newRowsPerPage === 30 || newRowsPerPage === 45) {
            setRowsPerPage(newRowsPerPage);
        }
    };

    const dataFiltered = applyFilter({
        inputData: dispatchesData,
        comparator: getComparator(order, orderBy),
    });

    console.log('derlivery', dataFiltered)

    const notFound = !dataFiltered.length;
    return (
        <>
            <Card>
                <TableToolbar
                    numSelected={selected.length}
                    label='Search dispatches..'
                />
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <SharedTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={dispatchesData.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                headLabel={deliveryOrderHeaderRow}
                            />
                            {!loading ? (<TableBody>
                                {dataFiltered
                                    .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <DoOrderTableRow
                                            orderNo={row.loading_instruction[0].order_head.id}
                                            invoiceNo={row.loading_instruction[0].lr_number}
                                            doNo={row.do_num}
                                            millName={row.mill.name}
                                            name={row.trader}
                                            date={row.loading_instruction[0].date ? format(parseISO(row.loading_instruction[0].date), 'MM/dd/yyyy') : 'Not given'}
                                            vehicleNumber={row.vehicle_num !== null ? row.vehicle_num : '   Not given'}
                                            quantity={row.qty}
                                            billedTo={`${row.loading_instruction[0].billing_address.name}\n${row.billing_gstin}\n${row.loading_instruction[0].billing_address.address}`}
                                            shipTo={`${row.loading_instruction[0].address.name}\n${row.address_gstin}\n${row.loading_instruction[0].address.address}`}
                                            rate={row.loading_instruction[0].qty}
                                            grade={row.loading_instruction[0].order_head.price}
                                        />
                                    ))}
                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page-1, rowsPerPage / 15, dataFiltered.length)}
                                />
                                {notFound && <TableNoData query={searchTerm} />}
                            </TableBody>) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: 2, alignItems: 'center', height: '250px', transform: 'scaleX(90)' }}>
                                    <SkeletonLoader />
                                </Box>
                            )}
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    page={page}
                    component="div"
                    count={dataFiltered.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[15, 30, 45]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
}

