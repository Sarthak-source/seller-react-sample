import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFullScreen } from 'src/redux/actions/full-screen-action'; // Move this import statement above


import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { setLoadingInstructionScreen } from 'src/redux/actions/loading-instruction-action';
import NetworkRepository from '../../../../app-utils/network_repository'; // Adjust the path
import TableEmptyRows from '../../table-empty-rows';
import SharedTableHead from '../../table-head';
import TableNoData from '../../table-no-data';
import TableToolbar from '../../table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../../utils';
import DispatchTableRow from '../dispatches-table-row/dispatch-table-row';
import { useDispatchesTableFormat } from '../use-dispatches-table-formate';



// Rest of the component code...

export default function InoviceCard(
    { status }
) {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const totalPages = Math.ceil(totalDataCount / rowsPerPage);

    const [dispatchesData, setDispatchesData] = useState([]);
    const { invoiceHeaderRow } = useDispatchesTableFormat();
    const [loading, setLoading] = useState(true);
    const selectedMill = useSelector((state) => state.mill.selectedMill);
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const currentState = useSelector((state) => state.stateRefreash.currentState);

    const dispatch = useDispatch();


    useEffect(() => {
        setPage(1)
        setDispatchesData([])
    }, [selectedMill, searchTerm, status])



    useEffect(() => {
        const fetchDispatchesData = async (dispatchesPage, text, currentStatus, millId) => {
            try {
                setLoading(true);
                const data = await NetworkRepository.invoicesReport(dispatchesPage, text, currentStatus, millId, selectedUser.id);
                setTotalDataCount(data.count);
                console.log('here', data.results)
                setDispatchesData(data.results);
            } catch (error) {
                console.error('Error fetching Dispatches data:', error);
            } finally {
                setLoading(false); // Set loading to false when data is fetched (whether successful or not)
            }
        };
        fetchDispatchesData(page, searchTerm, status, selectedMill.id);
    }, [page, status, selectedMill, searchTerm, selectedUser.id, currentState]);

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

    const dataFiltered = applyFilter({
        inputData: dispatchesData,
        comparator: getComparator(order, orderBy),

    });


    const dataFormated = dataFiltered.map(row => ({
        type: 'invoice',
        doPk: row.delivery_order,
        orderNo: row.loading_instruction[0].order_head.id,
        lrNum: row.loading_instruction[0].lr_number,
        invoiceNo: row.invoice_num !== '0' ? row.invoice_num : row.dc_num,
        lrId: row.loading_instruction[0].id,
        millName: row.mill.name,
        name: row.trader.name,
        date: row.loading_instruction[0].date ? format(parseISO(row.loading_instruction[0].date), 'dd/MMM/yyyy') : 'Not given',
        vehicleNumber: row.vehicle_num,
        quantity: row.total_qty,
        billedTo: `${row.loading_instruction[0].billing_address.name}\n${row.billing_gstin}\n${row.loading_instruction[0].billing_address.address}`,
        shipTo: `${row.loading_instruction[0].address.name}\n${row.address_gstin}\n${row.loading_instruction[0].address.address}`,
        rate: row.loading_instruction[0].qty,
        grade: row.loading_instruction[0].order_head.price,
        remark:row.remark,
        loadingInstructions: row,
    }));

    const handleExportCSV = () => {
        const dataToExport = [
            invoiceHeaderRow.map((row) => row.label),
            ...dataFormated.map((row) => [
                row.orderNo,
                row.lrNum,
                row.invoiceNo,
                row.millName,
                row.name,
                row.date,
                row.vehicleNumber,
                row.quantity,
                row.billedTo.replace(/[\r\n]/g, ' ').replace(/#/g, '').replace(/,/g, ''), // Replace line breaks with a space
                row.shipTo.replace(/[\r\n]/g, ' ').replace(/#/g, '').replace(/,/g, ''),   // Replace line breaks with a space
                row.rate,
                row.grade,
            ]),
        ];

        const csvContent = `data:text/csv;charset=utf-8,${dataToExport.map((row) => row.join(',')).join('\n')}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'dispatches_data.csv');
        document.body.appendChild(link);
        link.click();
    };


    // Example usage:
    console.log(dataFormated);



    const [isFullScreen, setIsFullScreen] = useState(true);


    const fullScreen = () => {
        dispatch(setFullScreen(!isFullScreen));
        setIsFullScreen(!isFullScreen)
    }

    useEffect(() => {
        dispatch(setLoadingInstructionScreen({ loadingsInstruction: 'invoice', currentStatus: status }));

    }, [dispatch,status])

    console.log('ivoice', dataFiltered)

    const notFound = !dataFiltered.length;
    return (
        <>

            <Card>

                <TableToolbar
                    numSelected={selected.length}
                    identifier='InoviceCard'
                    label='Search dispatches..'
                    onDownload={handleExportCSV}
                    onFullScreen={() => fullScreen()}
                />
                <Scrollbar>
                    <TableContainer sx={{ height: '70vh', overflow: 'auto' }}>
                        <Table stickyHeader sx={{ minWidth: 800 }}>
                            <SharedTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={dataFormated.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                headLabel={invoiceHeaderRow}
                            />

                            {!loading ? (
                                <TableBody>
                                    {dataFormated
                                        .map((row) => (
                                            <DispatchTableRow
                                                type={row.type}
                                                subtype={status}
                                                orderNo={row.orderNo}
                                                doPk={row.doPk}
                                                lrNum={row.lrNum}
                                                lrId={row.lrId}
                                                invoiceNo={row.invoiceNo}
                                                millName={row.millName}
                                                name={row.name}
                                                date={row.date}
                                                vehicleNumber={row.vehicleNumber}
                                                quantity={row.quantity}
                                                billedTo={row.billedTo}
                                                shipTo={row.shipTo}
                                                rate={row.rate}
                                                grade={row.grade}
                                                remark={row.remark}
                                                loadingInstructions={row.loadingInstructions}
                                            />
                                        ))}
                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={emptyRows(page - 1, rowsPerPage / 15, dataFiltered.length)}
                                    />
                                    {notFound && <TableNoData query={searchTerm} />}
                                </TableBody>
                            ) : (

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

InoviceCard.propTypes = {
    status: PropTypes.string,
};

