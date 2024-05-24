import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { useRouter } from 'src/routes/hooks';
import TableEmptyRows from '../dashboard/table-empty-rows';
import SharedTableHead from '../dashboard/table-head';
import TableNoData from '../dashboard/table-no-data';
import TableToolbar from '../dashboard/table-toolbar';
import { applyFilter, getComparator } from '../dashboard/utils';
import ProductTableRow from './product-table-row/product-table-row';
import { useProductTableFormat } from './use-product-table-form';

export default function ProductTableView() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('code');
    const [userData, setUserData] = useState([]);
    const { productHeaderRow } = useProductTableFormat();
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const users = await NetworkRepository.getProductList('', selectedUser.id);
                setUserData(users);
            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, selectedUser.id]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    };

    const userSearch = userData?.filter((item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const dataFiltered = applyFilter({
        inputData: userSearch,
        comparator: getComparator(order, orderBy),
    });

    const notFound = !dataFiltered.length;

    const handleOpenUser = () => {
        router.replace('/home/products/add-products');
    }

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
                <Typography variant="h4" mt={2} mb={-2}>Products</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenUser}>
                    Add Products
                </Button>
            </Stack>

            {!loading ? (
                <Card>
                    <TableToolbar
                        numSelected={0}
                        showIcons={false}
                        label='Search code or type..'
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
                                    headLabel={productHeaderRow}
                                />
                                <TableBody>
                                    {dataFiltered.map((row) => (
                                        <ProductTableRow
                                            key={row.id}
                                            name={row.code}
                                            status={row.status}
                                            productType={row.product_type.product_type}
                                        />
                                    ))}
                                    <TableEmptyRows height={77} emptyRows={0} />
                                    {notFound && <TableNoData query={searchTerm} />}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <SkeletonLoader />
                </Box>
            )}
        </Container>
    );
}
