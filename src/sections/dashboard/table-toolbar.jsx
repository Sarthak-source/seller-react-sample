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
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import { selectMill } from 'src/redux/actions/mill-action';
import { setSearchTerm } from 'src/redux/actions/search-action';

// ----------------------------------------------------------------------

export default function TableToolbar({ numSelected, label, onDownload, showIcons = true }) {
  const [open, setOpen] = useState(null);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const selectedMill = useSelector((state) => state.mill.selectedMill);
  const searchTerm = useSelector((state) => state.search.searchTerm);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (mill) => {
    dispatch(selectMill(mill));
    setOpen(null);
  };

  const handleSearch = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  console.log('selectedUser', selectedUser);
  console.log('selectedMill', selectedMill);

  const renderMillMenuItems = () => {
    if (!selectedUser || !selectedUser.mills) {
      return null;
    }

    return selectedUser.mills.map((mill, index) => (
      <MenuItem
        key={index}
        onClick={() => handleCloseMenu(mill)}
        sx={{
          height: 40,
          backgroundColor: mill.id === selectedMill.id ? 'primary.main' : 'initial',
          color: mill.id === selectedMill.id ? 'white' : 'initial',
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
          value={searchTerm}
          onChange={handleSearch}
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

      {showIcons && (
        numSelected > 0 ? (
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
                {selectedMill !== '' ? (
                  <Iconify icon="iconoir:filter-list-circle" color="primary.main" />
                ) : (
                  <Iconify icon="ic:round-filter-list" color="primary.main" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        )
      )}

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => handleCloseMenu(selectedMill)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{
          height: 40,
          backgroundColor: selectedMill === '' ? 'primary.main' : 'initial',
          color: selectedMill === '' ? 'white' : 'initial',
          opacity: 0.8,
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
        }} onClick={() => handleCloseMenu('')}>
          All
        </MenuItem>
        {renderMillMenuItems()}
      </Popover>
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  onDownload: PropTypes.func,
  label: PropTypes.string,
  showIcons: PropTypes.bool,
};
