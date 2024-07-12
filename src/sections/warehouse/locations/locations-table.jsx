import { useTheme } from '@emotion/react';
import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { useRouter } from 'src/routes/hooks';
import TableHeader from '../table-header';

export default function LocationsTableView() {
    const theme = useTheme();
    const router = useRouter();
    const [locations, setLocationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
    const [selectedOption, setSelectedOption] = useState('');
    const [warehouse, setWarehouseData] = useState([]);
    const [selectWarehouse, setSelectWarehouse] = useState('');

    const dispatch = useDispatch();

    const handleOpenlocationsView = () => {
        router.replace('/home/locations-management/add-locations-form');
    };

    const handleUpdatelocations = (row) => {
        router.replace('/home/locations-management/add-locations-form');
    };

    useEffect(() => {
        const fetchLocationsData = async () => {
            try {
                setLoading(true);
                const data = await NetworkRepository.getWarehouseLocationList(selectWarehouse || '');
                setLocationsData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        if (selectWarehouse !== '') {
            fetchLocationsData();
        }
    
        return () => {
            setLocationsData([]); // Reset data on component unmount
        };
    }, [selectedUserConfig, selectWarehouse, selectedOption]);
    

    useEffect(() => {
        const fetchWareHouseBatchData = async () => {
            try {
                setLoading(true);
                const data = await NetworkRepository.getWarehouseList(selectedOption, selectedUserConfig.seller.id);
                setWarehouseData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchWareHouseBatchData();
    }, [selectedOption, selectedUserConfig]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSelectWarehouseChange = (event) => {
        setSelectWarehouse(event.target.value);
    };

    console.log('locations', locations)

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Locations
                </Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenlocationsView}>
                    Add locations
                </Button>
            </Stack>

            <TableHeader
                selectedUser={selectedUserConfig.seller}
                selectedOption={selectedOption}
                handleSelectChange={handleSelectChange}
                warehouses={warehouse}
                selectWarehouse={selectWarehouse}
                onSelectWarehouse={handleSelectWarehouseChange}
                useIn="LocationsTableView"
            />

            {loading ? (
                <SkeletonLoader marginTop="-100" />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Warehouse</TableCell>
                                <TableCell style={{ position: 'sticky', right: 0, zIndex: 0 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {locations.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.created_by}</TableCell>
                                    <TableCell>{new Date(item.created_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Label>{item.is_active === 'Active' ? 'Active' : 'Inactive'}</Label>
                                    </TableCell>
                                    <TableCell>{item.ware_house}</TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            position: 'sticky',
                                            right: 0,
                                            zIndex: 0,
                                            backgroundColor: theme.palette.common.white,
                                        }}
                                    >
                                        <IconButton onClick={() => handleUpdatelocations(item)}>
                                            <Iconify icon="eva:edit-fill" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
