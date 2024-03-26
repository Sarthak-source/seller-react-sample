import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';

import { useSelector } from 'react-redux';
import Header from './header';
import Main from './main';
import Nav from './nav';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const isFullScreen = useSelector((state) => state.fullScreen.fullScreenState);


  const handleOpenNav = () => {
    setOpenNav(prevOpenNav => !prevOpenNav);
  };

  return (
    <>
      {isFullScreen && (
        <Header onOpenNav={handleOpenNav} openNav={openNav} />)}
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >

        {isFullScreen && (<Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />)}
        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
