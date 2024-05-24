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
import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { setFullScreen } from 'src/redux/actions/full-screen-action';
import { selectOrderStep } from 'src/redux/actions/tab-step-action';
import { useRouter } from 'src/routes/hooks';
import NetworkRepository from '../../../app-utils/network_repository'; // Adjust the path
import { QontoConnector } from '../stepper-line';
import TableEmptyRows from '../table-empty-rows';
import SharedTableHead from '../table-head';
import TableNoData from '../table-no-data';
import TableToolbar from '../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';
import OrderTableRow from './order-table-row/order-table-row';
import { useOrderTableFormate } from './use-order-table-formate';

export default function OrdersView() {
    const selectedStep = useSelector((state) => state.tabSteps.orderStepState);
    const dispatch = useDispatch();

    const router = useRouter();
    const [page, setPage] = useState(1);
    const [activeStep, setActiveStep] = useState(selectedStep);
    const [order, setOrder] = useState('asc');
    const [pagination, setPagination] = useState(1);

    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const steps = useMemo(() => ['Accepted', 'Pending Bids', 'Completed', 'Rejected', 'All'], []);
    const querySteps = useMemo(() => ['Approved', 'Booked', 'DOIssued', 'Rejected', 'All'], []);
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transformValue, setTransformValue] = useState('scale(0.75)');
    const [isMouseOver, setIsMouseOver] = useState(true);
    const currentState = useSelector((state) => state.stateRefreash.currentState);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        setPage(1)
        setOrdersData([])
    }, [currentState])

    const handleStepSize = (isOver) => {
        setIsMouseOver(isOver);
        setTransformValue(!isMouseOver ? 'scale(0.85)' : 'scale(0.75)');
    };

    const { formatPrice, getStatusText, formatQty, formatQuantity, getPropertyValue, orderHeaderRow } = useOrderTableFormate();
    const totalPages = Math.ceil(totalDataCount / rowsPerPage);

    const selectedMill = useSelector((state) => state.mill.selectedMill);
    const searchTerm = useSelector((state) => state.search.searchTerm);
    useEffect(() => { }, [searchTerm])

    useEffect(() => {
        setPage(1)
        setOrdersData([])
    }, [selectedMill])

    const handleStepClick = (index) => {
        console.log(activeStep);
        setPage(1)
        setOrdersData([]);
        dispatch(selectOrderStep(index));
        setActiveStep(index);
    };

    useEffect(() => {
        const fetchOrdersData = async (ordersPage, status, millId) => {
            try {
                setLoading(true);
                const data = await NetworkRepository.allOrders(status, ordersPage, millId, selectedUser.id);
                console.log('here', data.results)
                setTotalDataCount(data.count);

                setOrdersData(data.results);
            } catch (error) {
                console.error('Error fetching Orders data:', error);
            } finally {
                setLoading(false); // Set loading to false when data is fetched (whether successful or not)
            }
        };
        fetchOrdersData(page, querySteps[activeStep], selectedMill.id);
    }, [page, pagination, querySteps, selectedMill, activeStep, currentState, selectedUser.id]);


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
        setPage(1);
        const newRowsPerPage = parseInt(event.target.value, 10);
        if (newRowsPerPage === 25 || newRowsPerPage === 50 || newRowsPerPage === 100) {
            setRowsPerPage(newRowsPerPage);
        }
    };

    const tenderSearch =
        ordersData.filter((item) =>
            item.tender_head.mill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

    const dataFiltered = applyFilter({
        inputData: tenderSearch,
        comparator: getComparator(order, orderBy),

    });

    const notFound = !dataFiltered.length;


    const dataFormated = dataFiltered.map(row => ({
        key: row.id,
        ordersId: row.id,
        traderName: row.trader.name,
        millName: row.tender_head.mill.name,
        date: format(parseISO(row.date), 'dd/MMM/yyyy'),
        price: formatPrice(row.price, row.tender_head.product.product_type.unit),
        status: getStatusText(row.status),
        tenderType: row.tender_head.tender_type,
        productType: row.tender_head.product.product_type.product_type,
        grade: row.tender_head.product.properties.length > 0 ? getPropertyValue(row.tender_head.product.properties, 'Grade', 'Grade not given') : 'Not given',
        season: row.tender_head.product.properties.length > 0 ? getPropertyValue(row.tender_head.product.properties, 'Season', 'Season Not given') : 'Not given',
        sale: formatQty(row.qty),
        loading: `${formatQuantity(row, 'yet_to_load', row.yet_to_load)} ${row.tender_head.product.product_type.unit}`,
        dispatched: `${formatQuantity(row, 'dispatched_qty', row.dispatched_qty)} ${row.tender_head.product.product_type.unit}`,
        balance: `${formatQuantity(row, 'available_qty', row.available_qty)} ${row.tender_head.product.product_type.unit}`,
        remark:row.remark,
        order: row,
    }));

    const handleExportCSV = () => {
        const dataToExport = [
            orderHeaderRow.map((row) => row.label),
            ...dataFormated.map((row) => [
                row.ordersId,
                row.traderName,
                row.millName,
                row.date,
                row.price.replace(/,/g, ''),
                row.status,
                row.tenderType,
                row.productType,
                row.grade,
                row.season,
                row.sale,
                row.loading,
                row.dispatched,
                row.balance,
                row.remark,
            ]),
        ];

        const csvContent = `data:text/csv;charset=utf-8,${dataToExport.map((row) => row.join(',')).join('\n')}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'orders_data.csv');
        document.body.appendChild(link);
        link.click();
    };

    const handleOpenSelfOrder = () => {
        router.replace('/home/self-order-create');
    };

    const [isFullScreen, setIsFullScreen] = useState(true);


    const fullScreen = () => {
        dispatch(setFullScreen(!isFullScreen));
        setIsFullScreen(!isFullScreen)
    }

    return (
        <>
           {isFullScreen && (  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Orders</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenSelfOrder}>
                    Self order
                </Button>
            </Stack>)}

            <Box sx={{
                width: 1,
                transform: transformValue,
                transition: 'transform 0.3s ease',
            }}
                onMouseEnter={() => handleStepSize(true)}
                onMouseLeave={() => handleStepSize(false)}
            >
                <Stepper activeStep={activeStep} alternativeLabel connector={<QontoConnector />} style={{ marginTop: '2.5%', marginBottom: '1.5%' }}>
                    {steps.map((label, index) => (
                        <Step key={`${label}${index}`}>
                            <StepLabel
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleStepClick(index)}
                            >
                                <Box sx={{ width: 1, transform: 'scale(0.85)' }}>{label}</Box>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {!loading ? (
                <Card>


                    <TableToolbar
                        numSelected={selected.length}
                        onDownload={handleExportCSV}
                        onFullScreen={() => fullScreen()}
                        label='Search orders..'
                    />
                    <Scrollbar>
                        <TableContainer sx={{ height:  '70vh', overflow: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 800 }}>
                                <SharedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    rowCount={ordersData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleSort}
                                    headLabel={orderHeaderRow}
                                />
                                <TableBody>
                                    {dataFormated
                                        .map((row) => (
                                            <OrderTableRow
                                                key={row.ordersId}
                                                ordersId={row.ordersId}
                                                traderName={row.traderName}
                                                millName={row.millName}
                                                date={row.date}
                                                price={row.price}
                                                status={row.status}
                                                tenderType={
                                                    row.tenderType}
                                                productType={row.productType}
                                                grade={row.grade}
                                                season={row.season}
                                                sale={row.sale}
                                                loading={row.loading}
                                                dispatched={row.dispatched}
                                                balance={row.balance}
                                                remark={row.remark}
                                                order={row.order}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={emptyRows(page - 1, rowsPerPage / 15, dataFiltered.length)}
                                    />

                                    {notFound && <TableNoData query={searchTerm} />}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        page={page}
                        component="div"
                        count={ordersData.length}
                        rowsPerPage={rowsPerPage}
                        nextIconButtonProps={{ disabled: page >= totalPages }}
                        backIconButtonProps={{ disabled: !(page > 1) }}
                        onPageChange={handleChangePage}
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