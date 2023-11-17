
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import NetworkRepository from '../../../../app-utils/network_repository'; // Adjust the path
import TableEmptyRows from '../../table-empty-rows';
import SharedTableHead from '../../table-head';
import TableNoData from '../../table-no-data';
import DoOrderTableRow from '../dispatches-table-row/delivery-order-table-row';

import TableToolbar from '../../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../../utils';

export default function DeliveryOrderCard(
    
) {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [dispatchesData, setDispatchesData] = useState([]);


    const fetchDispatchesData = async (dispatchesPage, text, step) => {

        try {
            const data = await NetworkRepository.deliveryOrders(dispatchesPage, text);
            console.log('here', data.results)
            setDispatchesData(prevData => [...prevData, ...data.results]);
        } catch (error) {
            console.error('Error fetching Dispatches data:', error);
        }
    };


    useEffect(() => {
        fetchDispatchesData(page, '',);
    }, [page]);



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

    const handleFilterByName = (event) => {
        setPage(1);
        setFilterName(event.target.value);
    };


    const dataFiltered = applyFilter({
        inputData: dispatchesData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;
    return (
        <>
            <Card>
                <TableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
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

                                headLabel={[
                                    { id: 'orderNo', label: 'Order No' },
                                    { id: 'invoiceNo', label: 'Invoice No' },
                                    { id: 'doNo', label: 'Do No' },
                                    { id: 'name', label: 'Mill name' },
                                    { id: 'trader', label: 'Trader' },
                                    { id: 'date', label: 'Date' },
                                    { id: 'vehicleNumber', label: 'Vehicle Number' },
                                    { id: 'quantity', label: 'Quantity' },
                                    { id: 'billedTo', label: 'Billed To' },
                                    { id: 'ShipTo', label: 'Shipped To' },
                                    { id: 'rate', label: 'Rate' },
                                    { id: 'grade', label: 'Grade' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (

                                        <DoOrderTableRow
                                            orderNo={row.loading_instruction[0].order_head.id}
                                            invoiceNo={row.loading_instruction[0].lr_number}
                                            doNo={row.do_num}
                                            millName={row.mill.name}
                                            name={row.trader}
                                           
                                            date={row.loading_instruction[0].date?format(parseISO(row.loading_instruction[0].date),'MM/dd/yyyy'):'Not given'}
                                            vehicleNumber={row.veicle_num!==null?row.veicle_num:'   Not given'}
                                            quantity={row.qty}
                                            billedTo={`${row.loading_instruction[0].billing_address.name}-${row.billing_gstin}-${row.loading_instruction[0].billing_address.address}`}
                                            shipTo={`${row.loading_instruction[0].address.name}-${row.address_gstin}-${row.loading_instruction[0].address.address}`}
                                            rate={row.loading_instruction[0].qty}
                                            grade={row.loading_instruction[0].order_head.price}

                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
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

