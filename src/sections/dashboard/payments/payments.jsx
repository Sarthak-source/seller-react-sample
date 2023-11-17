
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';


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
    const [pagination, setPagination] = useState(1);

    const [activeStep, setActiveStep] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [paymentsData, setPaymentsData] = useState([]);
    const steps = useMemo(() => ['All', 'Verified', 'Returned', 'Cancelled'], []);
    const querySteps = useMemo(() => ['', 'Verified', 'Returned', 'Cancel'], []);
    const [totalDataCount, setTotalDataCount] = useState(0);

    const [isDateOpen, setIsDateOpen] = useState(false); // Initialize isOpen state
    const [selectedDate, setSelectedDate] = useState('');
    const totalPages = Math.ceil(totalDataCount / rowsPerPage);

    const headerRow = [
        { id: 'paymentsId', label: 'Payments ID' },
        { id: 'amount', label: 'Amount' },
        { id: 'status', label: 'Status' },
        { id: 'millName', label: 'Mill Name' },
        { id: 'tradeName', label: 'Trader Name' },
        { id: 'date', label: 'Date' },
        { id: 'refNo', label: 'Referce no' },
        { id: '' },
    ]

    const handleStepClick = (index) => {
        console.log(activeStep);
        setPage(1)
        setPaymentsData([]);
        setActiveStep(index);
    };

    const handleDateChange = (date) => {
        setPaymentsData([]);
        const formattedDate = date.toDate().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        setSelectedDate(formattedDate);
    };

    const openDate = () => {
        setIsDateOpen(!isDateOpen); // Toggle the value of isDateOpen
    }

    console.log(paymentsData);


    useEffect(() => {
        const fetchPaymentsData = async (paymentsPage, status) => {
            try {



                const data = await NetworkRepository.getPayments(selectedDate, paymentsPage, status);
                setTotalDataCount(data.count);

                console.log('here', data.results)
                if (paymentsPage > pagination) {
                    setPagination(paymentsPage)
                }
                setPaymentsData(prevData => [...prevData, ...data.results]);
            } catch (error) {
                console.error('Error fetching payments data:', error);
            }
        };
        fetchPaymentsData(page, querySteps[activeStep]);
    }, [page, activeStep, querySteps, pagination, selectedDate]);


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
        setPage(1);
        setFilterName(event.target.value);
    };


    const dataFiltered = applyFilter({
        inputData: paymentsData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const dataFormatted = dataFiltered.map(row => ({
        paymentsId: row.id,
        amount: row.amount,
        status: row.status,
        millName: row.mill.name,
        tradeName: row.trader.name,
        date: format(parseISO(row.payment_date), 'MM/dd/yyyy'),
        refNo: row.ref_no,
    }));

    // ...

    const handleExportCSV = () => {
        const dataToExport = [
            headerRow.map((row) => row.label),
            ...dataFormatted.map((row) => [
                row.paymentsId,
                row.amount,
                row.status,
                row.millName,
                row.tradeName,
                row.date,
                row.refNo,
            ]),
        ];

        const csvContent = `data:text/csv;charset=utf-8,${dataToExport.map((row) => row.join(',')).join('\n')}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'payments_data.csv');
        document.body.appendChild(link);
        link.click();
    };


    const notFound = !dataFiltered.length && !!filterName;

    console.log('selectedDate', 'jhjhjh', selectedDate)

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Payments</Typography>

                {isDateOpen ?
                    (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker open onClose={openDate} value={selectedDate} label="Select date" onChange={handleDateChange} />
                            </DemoContainer>
                        </LocalizationProvider>
                    ) : (
                        <Button variant="contained"
                            onChange={handleDateChange}
                            onClick={openDate}
                            startIcon={<Iconify icon="eva:calendar-fill" />}>
                            {selectedDate === '' ? 'Find payments' : selectedDate}
                        </Button>
                    )
                }
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
                    onDownload={handleExportCSV}
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

                                headLabel={headerRow}
                            />
                            <TableBody>
                                {dataFormatted
                                    .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <PaymentsTableRow
                                            key={row.id}
                                            paymentsId={row.paymentsId}
                                            amount={row.amount}
                                            status={row.status}
                                            millName={row.millName}
                                            tradeName={row.tradeName}
                                            date={row.date}
                                            refNo={row.refNo}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage / 15, paymentsData.length)}
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
                    nextIconButtonProps={{ disabled: page >= totalPages }}
                    backIconButtonProps={{ disabled: !(page > 1) }}
                    rowsPerPageOptions={[15, 30, 45]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
}