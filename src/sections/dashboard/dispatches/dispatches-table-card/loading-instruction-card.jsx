import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import NetworkRepository from '../../../../app-utils/network_repository'; // Adjust the path
import TableEmptyRows from '../../table-empty-rows';
import SharedTableHead from '../../table-head';
import TableNoData from '../../table-no-data';
import DispatchTableRow from '../dispatches-table-row/dispatch-table-row';

import TableToolbar from '../../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../../utils';
import { useDispatchesTableFormat } from '../use-dispatches-table-formate';

export default function LoadingsInstructionCard(
    { status }
) {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dispatchesData, setDispatchesData] = useState([]);
    const { loadingInstructionHeaderRow } = useDispatchesTableFormat();
    const totalPages = Math.ceil(totalDataCount / rowsPerPage);
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

    const fetchDispatchesData = async (dispatchesPage, text, currentStatus, millId) => {
        setLoading(true)
        try {

            const data = await NetworkRepository.book(dispatchesPage, text, currentStatus, millId);
            console.log('here', data.results)
            setDispatchesData(prevData => [...prevData, ...data.results]);
        } catch (error) {
            console.error('Error fetching Dispatches data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispatchesData(page, searchTerm, status, selectedMill.id);
    }, [page, status, selectedMill, searchTerm]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleChangePage = (event, newPage) => {
        console.log(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {

        const newRowsPerPage = parseInt(event.target.value, 10);
        if (newRowsPerPage === 25 || newRowsPerPage === 50 || newRowsPerPage === 100) {
            setRowsPerPage(newRowsPerPage);
        }
    };



    const dataFiltered = applyFilter({
        inputData: dispatchesData,
        comparator: getComparator(order, orderBy),

    });

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
                                headLabel={loadingInstructionHeaderRow}
                            />
                            {!loading ? (
                                <TableBody>
                                    {dataFiltered
                                        .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <DispatchTableRow
                                                orderNo={row.id}
                                                invoiceNo={row.loading_instruction[0].lr_number}
                                                millName={row.mill}
                                                name={row.trader}
                                                date={format(parseISO(row.loading_instruction[0].date), 'MM/dd/yyyy')}
                                                vehicleNumber={row.vehicle_num}
                                                quantity={row.total_qty}
                                                billedTo={`${row.loading_instruction[0].billing_address.name}\n${row.billing_gstin}\n${row.loading_instruction[0].billing_address.address}`}
                                                shipTo={`${row.loading_instruction[0].address.name}\n${row.address_gstin}\n${row.loading_instruction[0].address.address}`}
                                                rate={row.loading_instruction[0].product != null ? row.loading_instruction[0].order_head.price : 'Not given'}
                                                grade={row.loading_instruction[0].product != null ? row.loading_instruction[0].product.code : 'Not given'}
                                            />
                                        ))}
                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={emptyRows(page, rowsPerPage / 15, dataFiltered.length)}
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
                    nextIconButtonProps={{ disabled: page >= totalPages }}
                    backIconButtonProps={{ disabled: !(page > 1) }}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[15, 30, 45]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
}

LoadingsInstructionCard.propTypes = {
    status: PropTypes.string,
};

