import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { fShortenNumberIndian } from 'src/utils/format-number';


// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, unit = '', total, icon, useShotHand, color = 'primary', sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      elevation={20}
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        {useShotHand ? (<Typography variant="h4">  {fShortenNumberIndian(total)} {unit}</Typography>) : (
          <Typography variant="h4">  {total} {unit}</Typography>
        )}

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  unit: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  useShotHand: PropTypes.bool,
  title: PropTypes.string,
  total: PropTypes.number,
};
