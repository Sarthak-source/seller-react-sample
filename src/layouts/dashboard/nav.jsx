import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { usePathname } from 'src/routes/hooks';

import { account } from 'src/_mock/account';

import Scrollbar from 'src/components/scrollbar';

import { Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useResponsive } from 'src/hooks/use-responsive';
import { setToggleAction } from 'src/redux/actions/toggle-screen';
import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [isHovered, setIsHovered] = useState(false);

  console.log('selectedUser',selectedUser)
  const canAccessItem = selectedUser.seller_role;


  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        scale: isHovered ? 80 : 0,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2, width: isHovered ? NAV.WIDTH : 80 }}>
        <Typography variant="subtitle2">
          {selectedUser.name && selectedUser.name.charAt(0).toUpperCase() + selectedUser.name.slice(1)}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={1} sx={{ px: 2 }}>
      {navConfig
        ?.filter(item => item.access_role.some(role => canAccessItem?.includes(role)))
        .map(item => (
          <NavItem key={item.title} item={item} />
        ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
    {isHovered&&(renderAccount)}
      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const lgUp = useResponsive('up', 'lg');
  const [toggle, setToggle] = useState(lgUp)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToggleAction(!toggle));

  }, [toggle, dispatch])


  const handleOpenNav = () => {
    if (!lgUp) {
      setToggle(!toggle)
    dispatch(setToggleAction(!toggle));
    }   
  };

  
  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        transition: 'width 0.3s ease',
        width: { lg: isHovered ? NAV.WIDTH : 80 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Drawer
        open={openNav}
        onClose={onCloseNav}       
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            transition: 'width 0.3s ease',
            width: isHovered ? NAV.WIDTH : 80,
          },
        }}
      >

        <Box onClick={handleOpenNav}>
        <img
          src="/assets/logo-full.png"
          alt="Logo"
         
          style={{ width: '60%', height: 'auto', marginLeft: '20px', marginTop: '15px' }}
        />

        </Box>
        

        {renderContent}
      </Drawer>
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const active = item.path === pathname;

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}

    >
      <ListItemButton
        component={RouterLink}
        href={item.path}
        sx={{
          py: 1.5,
          minHeight: 40,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          width: '100%',
          justifyContent: 'flex-start',
          ...(active && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
          }),
        }}
      >
        <Box
          component="span" sx={{
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: isHovered ? 2 : 0,
            transform: isHovered ? 'scale(1.2)' : 'scale(2)',
            transition: 'transform 0.3s ease',
          }}>

          {item.icon}


        </Box>

        <Box
          sx={{
            width: isHovered ? 1 : 1,
            
            transition: 'width 0.3s ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          component="span"
        >

          <Box sx={{ml:3}}>
          {item.title}
          </Box>
          
        </Box>
      </ListItemButton>
    </Card>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

