import { useTheme } from '@emotion/react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const MyBreadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();


  const handleClick = (path) => {
    console.log('path',path)
    navigate(path);
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{height:'1px',marginLeft:1,marginBottom:2.5}}>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
         
          <Typography fontSize={11} marginTop={0.5} key={name} >
           
            {name}
           
            
          </Typography>
         
        ) : (
         
          <Link fontSize={11}  key={name} color="primary.main" onClick={() => handleClick(routeTo)}>
           
            {name}
            
            
          </Link>
         
        );
      })}
    </Breadcrumbs>
  );
};

export default MyBreadcrumbs;
