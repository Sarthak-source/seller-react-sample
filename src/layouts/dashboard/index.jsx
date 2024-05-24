import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import { useDispatch, useSelector } from 'react-redux';
import { useResponsive } from 'src/hooks/use-responsive';
import { setToggleAction } from 'src/redux/actions/toggle-screen';
import Header from './header';
import Main from './main';
import Nav from './nav';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const isFullScreen = useSelector((state) => state.fullScreen.fullScreenState);
  const toggle = useSelector((state) => state.toggleState.toggleState);

  const lgUp = useResponsive('up', 'lg');
  const [openNav, setOpenNav] = useState(lgUp);


  console.log('toggle',toggle);
  const dispatch = useDispatch();


  useEffect(()=>{

    dispatch(setToggleAction(lgUp));

  },[lgUp,dispatch])

  useEffect(()=>{
  },[toggle])


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

        {isFullScreen && toggle&& (<Nav openNav onCloseNav={() => setOpenNav(false)} />)}
        <Main >{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
