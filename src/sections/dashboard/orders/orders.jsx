
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import Scrollbar from 'src/components/scrollbar';

import NetworkRepository from '../../../app-utils/network_repository'; // Adjust the path
import TableEmptyRows from '../table-empty-rows';
import SharedTableHead from '../table-head';
import TableNoData from '../table-no-data';
import TableToolbar from '../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';
import OrderTableRow from './order-table-row/order-table-row';

export default function OrdersView() {
    const [page, setPage] = useState(1);
    const [activeStep, setActiveStep] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const steps = ['All', 'Bids', 'Accepted', 'Completed', 'Rejected'];
    const [ordersData, setOrdersData] = useState([]);


    const handleStepClick = (index) => {
        console.log(activeStep);
        setActiveStep(index);
    };


    console.log(ordersData);

    const fetchOrdersData = async (ordersPage, status) => {
        try {
            const data = await NetworkRepository.allOrders('', ordersPage,);
            console.log('here', data.results)
            setOrdersData(data.results);
        } catch (error) {
            console.error('Error fetching Orders data:', error);
        }
    };


    useEffect(() => {
        fetchOrdersData(page, '');
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
        setPage(0);
        const newRowsPerPage = parseInt(event.target.value, 10);
        if (newRowsPerPage === 25 || newRowsPerPage === 50 || newRowsPerPage === 100) {
            setRowsPerPage(newRowsPerPage);
        }
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };


    const dataFiltered = applyFilter({
        inputData: ordersData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    function getStatusText(status) {
        let statusText;

        if (status === "close") {
            statusText = "Closed";
        } else if (status === "cancel") {
            statusText = "Canceled";
        } else if (status === "rejected") {
            statusText = "Rejected";
        } else if (status === "Approved") {
            statusText = "Bid Accepted";
        } else if (status === "booked") {
            statusText = "Bid Received";
        } else if (status === "doIssued") {
            statusText = "Completed";
        } else {
            statusText = `${status}`;
        }

        return statusText;
    }

    function formatQty(qty) {
        const qtyString = qty;
        const qtyParts = qtyString.split(".");

        if (qtyParts[1] === "00" || qtyParts[1] === "0") {
            return parseFloat(qtyString).toFixed(0);
        }
        return qtyString;
    }

    function formatQuantity(data, key, parts) {
        const qtyString = data[key].toString();
        const qtyParts = qtyString.split(".");

        if (parts.length === 2 && (qtyParts[1] === "00" || qtyParts[1] === "0")) {
            return parseFloat(qtyString).toFixed(0);
        }

        return qtyString;
    }


    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Orders</Typography>

            </Stack>
            <Box sx={{ width: 1, transform: 'scale(0.85)' }}>
                <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: '3%' }}>
                    {steps.map((label, index) => (
                        <Step key={`${label}${index}`}>
                            <StepLabel
                                onClick={() => handleStepClick(index)}
                            >
                                <Box sx={{ width: 1, transform: 'scale(0.85)' }}>{label}</Box>

                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Card>
                <TableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    label='Search orders..'
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <SharedTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={ordersData.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}

                                headLabel={[
                                    { id: 'ordersId', label: 'Orders no' },
                                    { id: 'millName', label: 'Mill name' },
                                    { id: 'traderName', label: 'Trader Name' },
                                    { id: 'date', label: 'Date' },
                                    { id: 'status', label: 'Status' },
                                    { id: 'price', label: 'Price/Unit' },
                                    { id: 'tenderType', label: 'Tender type' },
                                    { id: 'productType', label: 'Product' },
                                    { id: 'grade', label: 'Grade' },
                                    { id: 'season', label: 'Season' },
                                    { id: 'sale', label: 'Sale' },
                                    { id: 'loading', label: 'Loading' },
                                    { id: 'dispatched', label: 'Dispatched' },
                                    { id: 'balance', label: 'Balance', align: 'center' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <OrderTableRow
                                            key={row.id}
                                            ordersId={row.id}
                                            traderName={row.trader.name}
                                            millName={row.tender_head.mill.name}
                                            date={format(parseISO(row.date), 'MM/dd/yyyy')}
                                            price={`₹ ${row.price} ${row.tender_head.product.product_type.unit}`}
                                            status={getStatusText(row.status)}
                                            tenderType={
                                                row.tender_head.tender_type}
                                            productType={row.tender_head.product.product_type.product_type}
                                            grade={row.tender_head.product.properties.length > 0 ? row.tender_head.product.properties[0].value : 'Not given'}
                                            season={row.tender_head.product.properties.length > 0 ? row.tender_head.product.properties[1].value : 'Not given'}
                                            sale={formatQty(row.qty)}
                                            loading={`${formatQuantity(row, 'yet_to_load', row.yet_to_load)} ${row.tender_head.product.product_type.unit}`}
                                            dispatched={`${formatQuantity(row, 'dispatched_qty', row.yet_to_load)} ${row.tender_head.product.product_type.unit}`}
                                            balance={`${formatQuantity(row, 'available_qty', row.yet_to_load)} ${row.tender_head.product.product_type.unit}`}

                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, ordersData.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={ordersData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
}