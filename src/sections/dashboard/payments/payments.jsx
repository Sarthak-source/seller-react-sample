
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import NetworkRepository from '../../../app-utils/network_repository'; // Adjust the path
import TableEmptyRows from '../table-empty-rows';
import SharedTableHead from '../table-head';
import TableNoData from '../table-no-data';
import TableToolbar from '../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';
import PaymentsTableRow from './payment-table-row/payment-table-row';


export default function PaymentsView() {
    const [page, setPage] = useState(1);
    const [activeStep, setActiveStep] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const steps = ['All', 'Verified', 'Returned', 'Cancelled'];
    const [paymentsData, setPaymentsData] = useState([]);


    const handleStepClick = (index) => {
        console.log(activeStep);
        setActiveStep(index);
    };


    console.log(paymentsData);

    const fetchPaymentsData = async (paymentsPage, status) => {
        try {
            const data = await NetworkRepository.getPayments('', paymentsPage, status);
            console.log('here', data.results)
            setPaymentsData(data.results);
        } catch (error) {
            console.error('Error fetching payments data:', error);
        }
    };


    useEffect(() => {
        fetchPaymentsData(page, '');
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
        inputData: paymentsData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Payments</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:calendar-fill" />}>
                    Find payments
                </Button>
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
                    label='Search payments..'
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <SharedTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={paymentsData.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}

                                headLabel={[
                                    { id: 'paymentsId', label: 'Payments ID' },
                                    { id: 'amount', label: 'Amount' },
                                    { id: 'status', label: 'Status' },
                                    { id: 'millName', label: 'Mill Name' },
                                    { id: 'tradeName', label: 'Trader Name' },
                                    { id: 'date', label: 'Date' },
                                    { id: 'refNo', label: 'Referce no' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <PaymentsTableRow
                                            key={row.id}
                                            paymentsId={row.id}
                                            amount={row.amount}
                                            status={row.status}
                                            millName={row.mill.name}
                                            tradeName={row.trader.name}
                                            date={format(parseISO(row.payment_date), 'MM/dd/yyyy')}
                                            refNo={row.ref_no}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, paymentsData.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={paymentsData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
}