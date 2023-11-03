
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
import TenderTableRow from './tender-table-row/tender-table-row';


export default function TenderView() {
    const [page, setPage] = useState(1);
    const [activeStep, setActiveStep] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [tenderData, setTenderData] = useState([]);
    const steps = ['All', 'Pending Approval', 'Live', 'Rejected', 'Closed', 'Completed'];



    const handleStepClick = (index) => {
        console.log(activeStep);
        setActiveStep(index);
    };


    console.log(tenderData);

    const fetchTenderData = async (tenderPage, status) => {
        try {
            const data = await NetworkRepository.sellerTender(tenderPage, status);
            setTenderData(prevData => [...prevData, ...data.results]); // Add new data to existing data
        } catch (error) {
            console.error('Error fetching tender data:', error);
        }
    };



    useEffect(() => {
        fetchTenderData(page, '');
    }, [page]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleChangePage = (event, newPage) => {
        console.log('handleChangePage', newPage)
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
        inputData: tenderData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;


    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Tenders</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                    Add tenders
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
                    label='Search tenders..'
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <SharedTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={dataFiltered.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}

                                headLabel={[
                                    { id: 'tenderId', label: 'Tender no' },
                                    { id: 'name', label: 'Mill name' },
                                    { id: 'location', label: 'Location' },
                                    { id: 'date', label: 'Date' },
                                    { id: 'price', label: 'Price/Unit' },
                                    { id: 'status', label: 'Status' },
                                    { id: 'tenderType', label: 'Tender type' },
                                    { id: 'productType', label: 'Product' },
                                    { id: 'grade', label: 'Grade' },
                                    { id: 'season', label: 'Season' },
                                    { id: 'total', label: 'Total' },
                                    { id: 'sold', label: 'Sold' },
                                    { id: 'balance', label: 'Balance', align: 'center' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice((page-1) * rowsPerPage, (page) * rowsPerPage + rowsPerPage)
                                    .map((row) => (

                                        <TenderTableRow
                                            key={row.id}
                                            tenderId={row.id}
                                            name={row.mill.name}
                                            location={`${row.mill.location},\n${row.mill.state.name.charAt(0).toUpperCase() + row.mill.state.name.substring(1).toLowerCase()}`}
                                            date={format(parseISO(row.date), 'MM/dd/yyyy')}
                                            price={`₹ ${row.price} ${row.product.product_type.unit}`}
                                            status={row.status}
                                            tenderType={row.tender_type}
                                            productType={row.product.product_type.product_type}
                                            grade={row.product.properties.length > 0 ? row.product.properties[0].label : 'Not given'}
                                            season={row.product.properties.length > 0 ? row.product.properties[0].value : 'Not given'}

                                            total={row.qty}
                                            sold={row.approved_qty}
                                            balance={row.available_qty}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page , rowsPerPage/15, dataFiltered.length)}
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