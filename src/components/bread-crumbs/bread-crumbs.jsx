import { useTheme } from '@emotion/react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from '../iconify/iconify';

/**
 * Component for rendering breadcrumbs based on current URL path.
 * Uses Material-UI's Breadcrumbs, Link, and Typography components.
 * @returns {JSX.Element}
 */
const MyBreadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  /**
   * Handles breadcrumb link click event.
   * Navigates to the specified path.
   * @param {string} path - The path to navigate to.
   */
  const handleClick = (path) => {
    navigate(path);
  };

  // Extract path segments from current URL
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ height: '1px', marginLeft: lgUp ? 8 : -1, marginBottom: 2.5 }}>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography fontSize={11} marginTop={0.5} key={name} style={{ cursor: 'pointer' }}>
            {
              name === 'home' ? (
                <Iconify icon="lets-icons:home-duotone" sx={{ height: 18, width: 18, mt: -0.4, ml: 2 }} />
              ) : (
                <>{name}</>
              )
            }
          </Typography>

        ) : (

          <Link fontSize={11} key={name} color="primary.main" onClick={() => handleClick(routeTo)} style={{ cursor: 'pointer' }}>
            {
              name === 'home' ? (
                <Iconify icon="lets-icons:home-duotone" sx={{ height: 18, width: 18, mt: 1, ml: 2.5 }} />
              ) : (
                <>{name}</>
              )
            }
          </Link>

        );
      })}
    </Breadcrumbs>
  );
};

export default MyBreadcrumbs;
