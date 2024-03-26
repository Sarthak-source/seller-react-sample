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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { format, parseISO } from 'date-fns';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { setFullScreen } from 'src/redux/actions/full-screen-action';
import { selectPaymentStep } from 'src/redux/actions/tab-step-action';
import NetworkRepository from '../../../app-utils/network_repository'; // Adjust the path
import { QontoConnector } from '../stepper-line';
import TableEmptyRows from '../table-empty-rows';
import SharedTableHead from '../table-head';
import TableNoData from '../table-no-data';
import TableToolbar from '../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';
import PaymentsTableRow from './payment-table-row/payment-table-row';
import { usePaymentTableFormate } from './use-payment-table-formate';

export default function PaymentsView() {
    const selectedStep = useSelector((state) => state.tabSteps.paymentStepState);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(1);
    const [activeStep, setActiveStep] = useState(selectedStep);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [paymentsData, setPaymentsData] = useState([]);
    const steps = useMemo(() => ['All', 'Verified', 'Returned', 'Cancelled'], []);
    const querySteps = useMemo(() => ['', 'Verified', 'Returned', 'Cancel'], []);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [isDateOpen, setIsDateOpen] = useState(false); // Initialize isOpen state
    const [selectedDate, setSelectedDate] = useState('');
    const totalPages = Math.ceil(totalDataCount / rowsPerPage);
    const [loading, setLoading] = useState(true);
    const [transformValue, setTransformValue] = useState('scale(0.75)');
    const [isMouseOver, setIsMouseOver] = useState(true);
    const currentState = useSelector((state) => state.stateRefreash.currentState);
    const selectedMill = useSelector((state) => state.mill.selectedMill);
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    const { paymentHeaderRow } = usePaymentTableFormate();



    useEffect(() => {
        setPage(1)
        setPaymentsData([])
    }, [currentState])

    const handleStepSize = (isOver) => {
        setIsMouseOver(isOver);
        setTransformValue(!isMouseOver ? 'scale(0.85)' : 'scale(0.75)');
    };

    useEffect(() => { }, [searchTerm])

    useEffect(() => {
        setPage(1)
        setPaymentsData([])
    }, [selectedMill])


    const handleStepClick = (index) => {
        console.log(activeStep);
        setPage(1)
        setPaymentsData([]);
        dispatch(selectPaymentStep(index));
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
        const fetchPaymentsData = async (paymentsPage, status, millId) => {
            try {
                setLoading(true);
                const data = await NetworkRepository.getPayments(selectedDate, paymentsPage, status, millId, selectedUser.id);
                setTotalDataCount(data.count);

                console.log('paymentsPage', data.results)

                setPaymentsData(data.results);
            } catch (error) {
                console.error('Error fetching payments data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentsData(page, querySteps[activeStep], selectedMill.id);
    }, [page, activeStep, querySteps, pagination, selectedDate, selectedMill, currentState, selectedUser.id]);


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

    const tenderSearch =
        paymentsData.filter((item) =>
            item.mill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ref_no.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.trader.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );


    const dataFiltered = applyFilter({
        inputData: tenderSearch,
        comparator: getComparator(order, orderBy),

    });

    const dataFormatted = dataFiltered.map(row => ({
        paymentsId: row.id,
        amount: row.amount,
        status: row.status,
        millName: row.mill.name,
        tradeName: row.trader.name,
        date: format(parseISO(row.payment_date), 'dd/MMM/yyyy'),
        paymentType: row.payment_type.name,
        refNo: row.ref_no,
    }));

    const handleExportCSV = () => {
        const dataToExport = [
            paymentHeaderRow.map((row) => row.label),
            ...dataFormatted.map((row) => [
                row.date,
                row.paymentsId,
                row.amount,
                row.refNo,
                row.status,
                row.millName,
                row.paymentType,
                row.tradeName,
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

    const [isFullScreen, setIsFullScreen] = useState(true);


    const fullScreen = () => {
        dispatch(setFullScreen(!isFullScreen));
        setIsFullScreen(!isFullScreen)
    }


    const notFound = !dataFiltered.length;

    return (
        <>
           {isFullScreen && ( <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
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
                            endIcon={selectedDate !== '' ?
                                <Box onClick={() => { setSelectedDate('') }} marginTop={0.5}>
                                    <Iconify icon="fluent:calendar-cancel-16-filled" />
                                </Box> : null}
                            startIcon={selectedDate === '' ? <Iconify icon="eva:calendar-fill" /> : null}>
                            {selectedDate === '' ? 'Find payments' : selectedDate}
                        </Button>
                    )
                }
            </Stack> )}
            <Box sx={{ width: 1, transform: transformValue, transition: 'transform 0.3s ease', }}
                onMouseEnter={() => handleStepSize(true)}
                onMouseLeave={() => handleStepSize(false)}>
                <Stepper activeStep={activeStep} connector={<QontoConnector />} alternativeLabel style={{ marginTop: '2.5%', marginBottom: '1.5%' }}
                >
                    {steps.map((label, index) => (
                        <Step key={`${label}${index}`}>
                            <StepLabel
                                style={{ cursor: 'pointer' }}

                                onClick={() => handleStepClick(index)}>
                                <Box sx={{ width: 1, transform: 'scale(0.85)' }}>
                                    {label}
                                </Box>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {!loading ? (
                <Card>

                    <TableToolbar
                        numSelected={selected.length}
                        onFullScreen={() => fullScreen()}
                        onDownload={handleExportCSV}
                        label='Search payments..'
                    />
                    <Scrollbar>
                        <TableContainer sx={{ height: isFullScreen ? 'auto' : '70vh', overflow: 'auto' }}>
                            <Table sx={{ minWidth: 800 }}>
                                <SharedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    rowCount={paymentsData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleSort}
                                    headLabel={paymentHeaderRow}
                                />
                                <TableBody>
                                    {dataFormatted
                                        .map((row) => (
                                            <PaymentsTableRow
                                                key={row.id}
                                                paymentsId={row.paymentsId}
                                                amount={row.amount}
                                                paymentType={row.paymentType}
                                                status={row.status}
                                                millName={row.millName}
                                                tradeName={row.tradeName}
                                                date={row.date}
                                                refNo={row.refNo}
                                            />
                                        ))}
                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={emptyRows(page - 1, rowsPerPage / 15, paymentsData.length)}
                                    />
                                    {notFound && <TableNoData query={searchTerm} />}
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
                </Card>) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <SkeletonLoader />
                </Box>
            )}
        </>
    );
}