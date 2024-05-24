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
import { useUserTableFormat } from './use-user-table-formate';
import UserTableRow from './user-table-row/user-table-row';

export default function UserView() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    

    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [userData, setUserData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [nameController, setNameController] = useState('');
    const [numberController, setNumberController] = useState('');

    const { userHeaderRow } = useUserTableFormat();
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const selectedUser = useSelector((state) => state.user.selectedUser);

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                
                   
               const users=     await NetworkRepository.getUserList('',selectedUser.id);
               console.log(users)
               setUserData(users);
            
            } catch (error) {
                console.error('Error fetching User data:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
       
    }, [dispatch, selectedUser.id]);


    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const userSearch = userData?.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone_number.toString().toLowerCase().includes(searchTerm.toLowerCase())
        
    );

    const dataFiltered = applyFilter({
        inputData: userSearch,
        comparator: getComparator(order, orderBy),
    });

    const notFound = !dataFiltered.length;

    const handleOpenUser=()=>{
        router.replace('/home/users-view/add-users');
    }

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
                <Typography variant="h4" mt={2} mb={-2}>Sellers</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenUser}>
                    Add Sellers
                </Button>
            </Stack>

            {!loading ? (
                <Card >
                    <TableToolbar
                        numSelected={0}
                        showIcons={false}
                        label='Search name or Phone no..'
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
                                    headLabel={userHeaderRow}
                                />
                                <TableBody>
                                    {dataFiltered.map((row) => (
                                        <UserTableRow
                                            name={row.name}
                                            status={row.is_preferred === true ? "Active" : "Inactive"}
                                            
                                            phoneNumber={row.phone_number}
                                            email={row.email}
                                            mills={row.mills}
                                        />
                                    ))}
                                    <TableEmptyRows
                                        height={77}
                                        emptyRows={0}
                                    />
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
