import { Box, IconButton, MenuItem, Paper, Popover, Select, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function TableHeader({
  selectedUser,
  selectedOption,
  handleSelectChange,
  useIn,
  warehouses = [],
  selectWarehouse,
  onSelectWarehouse
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
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

  return (
    <Paper sx={{ borderRadius: '16px 16px 0 0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', gap: '16px' }}>
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

          {useIn === 'LocationsTableView' && (
            <Select
              value={selectWarehouse}
              onChange={onSelectWarehouse}
              displayEmpty
              style={{ width: '250px' }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="" disabled>
                Select a warehouse
              </MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

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
  );
}

// Define prop types for the component
TableHeader.propTypes = {
  selectedUser: PropTypes.any.isRequired,
  selectedOption: PropTypes.string.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  useIn: PropTypes.any,
  warehouses: PropTypes.array,
  selectWarehouse: PropTypes.string,
  onSelectWarehouse: PropTypes.func,
};
