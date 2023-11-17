import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Stack } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TableToolbar({ numSelected, filterName, onFilterName, label,onDownload }) {
  const [open, setOpen] = useState(null);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder={label}
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                color='primary.main'
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Download">
          <IconButton onClick={onDownload}>
            <Iconify icon="material-symbols:download" color='primary.main' />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filter list">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="ic:round-filter-list" color='primary.main'/>
          </IconButton>
        </Tooltip>
        </Stack>
        
        
      )}
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
       
      >
        <MenuItem onClick={handleCloseMenu}>
         
          All
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} >
         
        Test Mill Private Limited
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} >
         
        Test Mill Private Limited (Unit-1)
        </MenuItem>
      </Popover>
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDownload:PropTypes.func,
  label: PropTypes.string,
};
