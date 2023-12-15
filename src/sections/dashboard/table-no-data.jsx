import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            Not found
          </Typography>

          {
            query !== '' && (
              <Typography variant="body2">
                No results found for &nbsp;
                <strong>&quot;{query}&quot;</strong>.
                <br /> Try checking for typos or using complete words.
              </Typography>
            )
          }


          <Box
            component="img"

            src='https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg?w=1060&t=st=1702019602~exp=1702020202~hmac=57da9194b9435ec95e27dd6e62fa486527a2fbd01692ff3a09a04fbc6e18807d'
            sx={{
              top: 0,
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              position: 'inherit',
            }}
          />
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
