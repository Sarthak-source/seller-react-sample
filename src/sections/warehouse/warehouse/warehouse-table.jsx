import { useTheme } from '@emotion/react';
import { Box, Button, IconButton, MenuItem, Paper, Popover, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import { updateWarehouse } from 'src/redux/actions/warehouse-update-action';
import { useRouter } from 'src/routes/hooks';

export default function WarehouseTableView() {
  const theme = useTheme();
  const router = useRouter();
  const [warehouse, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const [selectedOption, setSelectedOption] = useState('');

  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleOpenWarehouseView = () => {
    dispatch(updateWarehouse({}));
    router.replace('/home/warehouse-management/add-warehouse-form');
  }

  const handleUpdateWarehouse = (row) => {
    dispatch(updateWarehouse(row));
    router.replace('/home/warehouse-management/add-warehouse-form');
  }

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
  }, [selectedUserConfig, selectedOption]);

  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const renderMillMenuItems = () => {
    if (!selectedUser || !selectedUser.mills) {
      return null;
    }

    return selectedUser.mills.map((mill, index) => (
      <MenuItem
        key={index}
        onClick={() => handleSelectChange({ target: { value: mill.id } })}
        sx={{
          height: 40,
          backgroundColor: mill.id === selectedOption ? 'primary.main' : 'initial',
          color: mill.id === selectedOption ? 'white' : 'initial',
          opacity: 0.8,
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
        }}
      >
        {mill.name}
      </MenuItem>
    ));
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Warehouse
        </Typography>
        <Button  variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenWarehouseView}>
          Add Warehouse
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: '16px 16px 0 0', }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Select
            value={selectedOption}
            
            onChange={handleSelectChange}
            displayEmpty
            style={{ width: '250px' }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              Select a mill
            </MenuItem>
            {selectedUser.mills.map((mill) => (
              <MenuItem key={mill.id} value={mill.id}>
                {mill.name}
              </MenuItem>
            ))}
          </Select>
          <Tooltip title="Filter list">
            <IconButton onClick={handleOpenMenu}>
              {selectedOption !== '' ? (
                <Iconify icon="iconoir:filter-list-circle" color="primary.main" />
              ) : (
                <Iconify icon="ic:round-filter-list" color="primary.main" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            sx={{
              height: 40,
              backgroundColor: selectedOption === '' ? 'primary.main' : 'initial',
              color: selectedOption === '' ? 'white' : 'initial',
              opacity: 0.8,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
            onClick={() => handleSelectChange({ target: { value: '' } })}
          >
            All
          </MenuItem>
          {renderMillMenuItems()}
        </Popover>
      </Paper>



      {loading ? (
        <SkeletonLoader marginTop='-100' />
      ) : (
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
                <TableCell style={{ position: 'sticky', right: 0, zIndex: 0 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouse.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.mill.name}</TableCell>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Label>
                      {item.is_active === 'Active' ? 'Active' : 'Inactive'}
                    </Label>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      position: 'sticky',
                      right: 0,
                      zIndex: 0,
                      backgroundColor: theme.palette.common.white,
                    }}
                  >
                    <IconButton onClick={() => handleUpdateWarehouse(item)}>
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
