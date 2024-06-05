import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

export default function WarehouseTableView() {
  const router = useRouter();
  const [warehouse, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenWarehouseView = () => {
    router.replace('/home/warehouse-management/add-warehouse-form');
  }

  useEffect(() => {
    const fetchWareHouseBatchData = async () => {
      try {
        setLoading(true);
        const data = await NetworkRepository.getWarehouseList();
        setWarehouseData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWareHouseBatchData();
  }, []);

  console.log('warehouse', warehouse);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Warehouse
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenWarehouseView}>
          Add Warehouse
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mill</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouse.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.mill}</TableCell>
                <TableCell>{item.area}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.is_active}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
