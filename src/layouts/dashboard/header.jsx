import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyBreadcrumbs from 'src/components/bread-crumbs/bread-crumbs';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { setToggleAction } from 'src/redux/actions/toggle-screen';
import { bgBlur } from 'src/theme/css';
import AccountPopover from './common/account-popover';
import Searchbar from './common/searchbar';
import { HEADER, NAV } from './config-layout';

export default function Header({ onOpenNav, openNav }) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');
  const [toggle, setToggle] = useState(lgUp);
  const isFullScreen = useSelector((state) => state.fullScreen.fullScreenState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToggleAction(!toggle));
  }, [toggle, dispatch]);

  // Function to handle opening/closing navigation drawer
  const handleOpenNav = () => {
    setToggle(!toggle);
    dispatch(setToggleAction(!toggle));
  };

  // JSX for rendering content in the header
  const renderContent = (
    <>
      <Stack marginLeft={-1}>
        <Stack direction='row' marginTop={2}>
          <IconButton onClick={handleOpenNav} sx={{ mr: toggle ? 5 : 0 }}>
            <Iconify icon="eva:menu-2-fill" color='primary.main' />
          </IconButton>
          <Searchbar />
        </Stack>
        <MyBreadcrumbs />
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* Additional components like LanguagePopover and NotificationsPopover can be added here */}
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <>
      {isFullScreen && (
        <AppBar
          sx={{
            boxShadow: 'none',
            height: HEADER.H_MOBILE,
            zIndex: theme.zIndex.appBar + 1,
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            transition: theme.transitions.create(['height'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(lgUp && {
              width: openNav ? `calc(100% - ${NAV.WIDTH}px)` : "100%",
              height: HEADER.H_DESKTOP,
            }),
          }}
        >
          <Toolbar
            sx={{
              height: 1,
              px: { lg: 5 },
            }}
          >
            {renderContent}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func, // Function to handle opening navigation
  openNav: PropTypes.bool,   // Boolean to indicate if navigation is open
};
