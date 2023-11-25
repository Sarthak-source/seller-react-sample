import { Box, Skeleton } from '@mui/material';

export default function SkeletonLoader() {
  return (
    <Box marginTop="300px" marginLeft="10%" width='100%'>
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

