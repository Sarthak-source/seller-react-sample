import { useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ip } from 'src/app-utils/api-constants';
import Label from 'src/components/label';
import { LongPressableBox } from 'src/components/long-press/long-press';
import { selectUser, selectUserConfig } from 'src/redux/actions/user-actions';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  // {
  //   label: 'Profile',
  //   icon: 'eva:person-fill',
  // },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-fill',
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [checked, setChecked] = useState(localStorage.getItem('isTestEnvironment') === 'true');
  const navigate = useNavigate();

  useEffect(() => {

    if (selectedUser.id === null) {
      navigate(`/404`);
    }

  }, [navigate,selectedUser])


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogOut = () => {
    dispatch(selectUser(null))
    dispatch(selectUserConfig(null))
    router.replace('/');
  };

  const handleChange = () => {
    const newChecked = !checked;
    localStorage.setItem('isTestEnvironment', newChecked.toString());
    setChecked(newChecked);
    window.location.reload();
  };

  const label = checked ? `TEST : ${ip}` : ``;

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 50,
          height: 50,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src='/assets/logo.png'
          alt={selectedUser?.name}
          sx={{
            width: 45,
            height: 45,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {selectedUser?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {selectedUser?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {selectedUser?.phone_number}
          </Typography>

        </Box>

        {label !== `` && (<LongPressableBox onLongPress={handleChange} body={
          <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 2 }}>


            <Label>
              {label}
            </Label>
          </Stack>
        } />)}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} /> */}



        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogOut}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
