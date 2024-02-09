import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';

import Header from './header';
import Main from './main';
import Nav from './nav';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  const handleOpenNav = () => {
    setOpenNav(prevOpenNav => !prevOpenNav);
  };

  return (
    <>
    <Header onOpenNav={handleOpenNav} openNav={openNav} />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />
        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
