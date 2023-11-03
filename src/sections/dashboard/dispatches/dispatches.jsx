
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
import DispatchTableRow from './dispatches-table-row/dispatch-table-row';

import TableToolbar from '../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';


export default function DispatchesView() {
    const [page, setPage] = useState(1);
    const [activeStep, setActiveStep] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const steps = ['Arriving', 'Reported', 'DO Issued', 'Loaded', 'Reported', 'Unloaded'];
    const [dispatchesData, setDispatchesData] = useState([]);


    const handleStepClick = (index) => {
        console.log(activeStep);
        setActiveStep(index);
    };


    console.log(dispatchesData);

    const fetchDispatchesData = async (dispatchesPage, text) => {
        try {
            const data = await NetworkRepository.deliveryOrders(dispatchesPage, text);
            console.log('here', data.results)
            setDispatchesData(data.results);
        } catch (error) {
            console.error('Error fetching Dispatches data:', error);
        }
    };


    useEffect(() => {
        fetchDispatchesData(page, '');
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
        if (newRowsPerPage === 25 || newRowsPerPage === 50 || newRowsPerPage === 100) {
            setRowsPerPage(newRowsPerPage);
        }
    };

    const handleFilterByName = (event) => {
        setPage(0);
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Dispatches</Typography>

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
                                    { id: 'name', label: 'Mill name' },
                                    { id: 'orderType', label: 'Order type' },
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

                                        <DispatchTableRow
                                            key={row.id}
                                            dispatchesId={row.id}
                                            name={row.mill.name}
                                            location={`${row.mill.location},\n${row.mill.state.name.charAt(0).toUpperCase() + row.mill.state.name.substring(1).toLowerCase()}`}
                                            date={format(parseISO(row.date), 'MM/dd/yyyy')}
                                            price={`₹ ${row.price} ${row.product.product_type.unit}`}
                                            status={row.status}
                                            DispatchesType={row.dispatches_type}
                                            grade={row.product.product_type.product_type}
                                            season={row.id}
                                            total={row.qty}
                                            sold={row.approved_qty}
                                            balance={row.available_qty}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, dispatchesData.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={dispatchesData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
}