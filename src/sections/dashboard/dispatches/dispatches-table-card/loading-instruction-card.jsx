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
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        setPage(1)
        setDispatchesData([])
    }, [searchTerm, status, selectedMill])



    useEffect(() => {
        const fetchDispatchesData = async (dispatchesPage, text, currentStatus, millId) => {
            setLoading(true)
            try {

                const data = await NetworkRepository.book(dispatchesPage, text, currentStatus, millId, selectedUser.id);
                setTotalDataCount(data.count);
                console.log('here', data.results)
                setDispatchesData(prevData => [...prevData, ...data.results]);
            } catch (error) {
                console.error('Error fetching Dispatches data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDispatchesData(page, searchTerm, status, selectedMill.id);
    }, [page, status, selectedMill, searchTerm, selectedUser.id]);

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

    console.log('dataFiltered', dataFiltered)

    const dataFormated = dataFiltered.map(row => ({
        orderNo: row.loading_instruction[0].order_head.id,
        lrNum: row.loading_instruction[0].lr_number,
        lrId: row.loading_instruction[0].id,
        millName: row.mill,
        name: row.trader,
        date: format(parseISO(row.loading_instruction[0].date), 'dd/MMM/yyyy'),
        vehicleNumber: row.veicle_num,
        quantity: row.total_qty,
        billedTo: `Name-${row.loading_instruction[0].billing_address.name}-GSTIN-${row.billing_gstin}-Billing address-${row.loading_instruction[0].billing_address.address}`,
        shipTo: `Name-${row.loading_instruction[0].address.name}-GSTIN-${row.address_gstin}-Billing address-${row.loading_instruction[0].address.address}`,
        rate: row.loading_instruction[0].product != null ? row.loading_instruction[0].order_head.price : 'Not given',
        grade: row.loading_instruction[0].product != null ? row.loading_instruction[0].product.code : 'Not given',
        qcStatus: row.qc_status,
        loadingInstructions: row,
    }));

    console.log(
        'dataFormated', dataFormated
    )

    const handleExportCSV = () => {

        const dataToExport = [
            loadingInstructionHeaderRow.map((row) => row.label),
            ...dataFormated.map((row) => [
                row.orderNo,
                row.lrNum,
                row.qcStatus,
                row.millName,
                row.name,
                row.date,
                row.vehicleNumber,
                row.quantity,
                row.billedTo.replace(/,/g, '').replace(/[\r\n]/g, ''),
                row.shipTo.replace(/,/g, '').replace(/[\r\n]/g, ''),
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



    const notFound = !dataFiltered.length;
    return (
        <>
            <Card>
                <TableToolbar
                    numSelected={selected.length}
                    label='Search dispatches..'
                    onDownload={handleExportCSV}
                />
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <SharedTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={dataFormated.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                headLabel={loadingInstructionHeaderRow}
                            />
                            {!loading ? (
                                <TableBody>
                                    {dataFormated
                                        .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <DispatchTableRow
                                                type='loadingsInstruction'
                                                subtype={status}
                                                key={row.orderNo}
                                                orderNo={row.orderNo}
                                                lrNum={row.lrNum}
                                                lrId={row.lrId}
                                                millName={row.millName}
                                                name={row.name}
                                                date={row.date}
                                                vehicleNumber={row.vehicleNumber}
                                                quantity={row.quantity}
                                                billedTo={row.billedTo}
                                                shipTo={row.shipTo}
                                                rate={row.rate}
                                                grade={row.grade}
                                                qcStatus={row.qcStatus}
                                                loadingInstructions={row.loadingInstructions}
                                            />
                                        ))}
                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={emptyRows(page - 1, rowsPerPage / 15, dataFiltered.length)}
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

