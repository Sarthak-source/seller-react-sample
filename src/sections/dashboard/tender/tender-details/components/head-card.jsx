import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';

const HeaderCard = ({ data }) => {
    const exName = data.visibility.map(visibility => `, ${visibility}`).join('');

    const statusColors = {
        close: 'grey',
        rejected: 'red',
        active: 'blue',
        added: '#ff9800',
        default: 'green'
    };

    const statusLabels = {
        close: 'Closed',
        rejected: 'Rejected',
        active: 'Live',
        added: 'Pending Approval',
        default: 'Completed'
    };

    return (
        <Card
            style={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
        >
            <Box
                style={{
                    backgroundColor: '#e0f2f1',
                }}
            >
                {/* Insert your onTap logic here */}

                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '10px',
                    }}
                >
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'flex-end',
                        }}
                    >
                        <Typography variant="h6" style={{ marginLeft: '10px' }}>
                            {data.mill.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Tender No. {data.id}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color={statusColors[data.status] || statusColors.default}
                        >
                            {statusLabels[data.status] || statusLabels.default}
                        </Typography>
                        <Typography variant="subtitle1">
                            INR {parseFloat(data.price).toFixed(2)} / {data.product.product_type.unit}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Product Type
                            </TableCell>
                            <TableCell>
                               Product Code
                            </TableCell>
                            <TableCell>
                                Sold
                            </TableCell>
                            <TableCell>
                                Quantity
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                
                                    {data.product.product_type.product_type}
                               
                            </TableCell>
                            <TableCell>
                                {data.product.code}
                            </TableCell>
                            <TableCell>
                                {data.sold === null ? 'None' : data.sold}
                            </TableCell>
                            <TableCell>
                                
                                    {parseFloat(data.qty).toFixed(2)} {data.product.product_type.unit}
                                
                            </TableCell>
                        </TableRow>
                        {data.product.properties.map((property, index) => (
                                <TableRow key={index}>
                                    <TableCell>{property.label}</TableCell>
                                    <TableCell>{property.value}</TableCell>
                                </TableRow>
                            ))}
                        {/* Add more rows if needed */}
                    </TableBody>
                </Table>
            </TableContainer>

            

            <Box
                style={{
                    borderRadius: '0 0 8px 8px',
                    backgroundColor: '#e0f2f1',
                    padding: '6px 10px',
                }}
            >
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="subtitle1" color="textSecondary">
                        Created By:
                    </Typography>
                    <Typography variant="subtitle1">
                        {data.seller}
                    </Typography>
                </Box>

                {data.is_exclusive && (
                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="caption" color="textSecondary">
                            Exclusive to:
                        </Typography>
                        <Typography style={{ textAlign: 'end' }}>
                            {exName.substring(2).replaceAll(', ', '\n')}
                        </Typography>
                    </Box>
                )}
                <Box style={{ height: '14px' }} />
                <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/* Insert your buttons here */}
                </Box>
            </Box>
        </Card>
    );
};

HeaderCard.propTypes = {
    data: PropTypes.any,
};

export default HeaderCard;
