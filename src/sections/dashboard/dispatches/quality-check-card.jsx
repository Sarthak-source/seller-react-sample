import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Label from 'src/components/label';
import { primary } from 'src/theme/palette';



// ----------------------------------------------------------------------

export default function QuatityCheckCard({ item }) {

    const renderName = (
        <Label
            color={primary.main}
            sx={{
                position: 'absolute',
                textTransform: 'uppercase',
            }}
        >
            {item?.title}
        </Label>
    );

    console.log('item', item)


    const renderImg = (
        <Box
            component="img"
            alt={item?.title || 'Unknown Driver'}
            src={item?.imageUrl || 'https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg?w=1060&t=st=1702019602~exp=1702020202~hmac=57da9194b9435ec95e27dd6e62fa486527a2fbd01692ff3a09a04fbc6e18807d'}
            sx={{
                top: 0,
                width: 1,
                height: 1,
                objectFit: 'cover',
                position: 'absolute',
            }}
        />
    );

    return (
        <Card
            onMouseEnter={(e) => {
                e.currentTarget.style.borderRadius = '8px';
                e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderRadius = '8px';
                e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
            }}
        >
            <Box sx={{ pt: '100%', position: 'relative' }}>
                {renderImg}
            </Box>

            <Stack spacing={2} sx={{ pb: 4.5, pl: 2 }}>
                {renderName}
            </Stack>
        </Card>
    );
}

QuatityCheckCard.propTypes = {
    item: PropTypes.object,

};
