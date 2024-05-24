import { Avatar, Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Label from 'src/components/label';
import { useProductTableFormat } from '../use-product-table-form';

export default function ProductTableRow({
    name,
    status,
    productType,
}) {
    const [openDialog, setOpenDialog] = useState(false);
    const { getStatusColor } = useProductTableFormat();

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox">
                <TableCell
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderRadius = '8px';
                        e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={handleOpenDialog}
                    component="th"
                    scope="row"
                    padding="normal"
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={name} src="avatarUrl" />
                        <Typography variant="subtitle2" noWrap>
                            {name}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell>{productType}</TableCell>
                <TableCell>
                    <Label color={getStatusColor(status)}>{status}</Label>
                </TableCell>
            </TableRow>
        </>
    );
}

ProductTableRow.propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    productType: PropTypes.string.isRequired,
};
