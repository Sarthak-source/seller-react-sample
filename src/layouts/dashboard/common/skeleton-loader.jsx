import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonLoader({ marginTop = '300px' }) {
  return (
    <Box marginTop={marginTop} marginLeft="10%" width='100%'>
      <Skeleton variant="rectangular" width="50%" height={20} animation="wave" />
      <Skeleton variant="rectangular" width="90%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="30%" height={20} animation="wave" />
      <Skeleton variant="rectangular" width="60%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="50%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="90%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="30%" height={20} animation="wave" />
      <Skeleton variant="rectangular" width="60%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="50%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="90%" height={20} animation="wave" style={{ margin: '20px 0' }} />
      <Skeleton variant="rectangular" width="30%" height={20} animation="wave" />
      <Skeleton variant="rectangular" width="60%" height={20} animation="wave" style={{ margin: '20px 0' }} />
    </Box>
  );
};

SkeletonLoader.propTypes = {
  marginTop: PropTypes.string,
};