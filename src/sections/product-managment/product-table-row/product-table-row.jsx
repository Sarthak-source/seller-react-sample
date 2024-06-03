import { Avatar, Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Label from 'src/components/label';
import { selectProductData } from 'src/redux/actions/update-product-action';
import { useRouter } from 'src/routes/hooks';
import { useProductTableFormat } from '../use-product-table-form';

export default function ProductTableRow({
    name,
    status,
    productType,
    row,
}) {
    const [openDialog, setOpenDialog] = useState(false);
    const { getStatusColor } = useProductTableFormat();
    const router = useRouter();
    const dispatch = useDispatch();


    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleProductUpdate = (product) => {
        dispatch(selectProductData(product));
        router.replace('/home/products/add-products');
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
                    onClick={()=>handleProductUpdate(row)}
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
    row: PropTypes.any.isRequired,
};
