import { Box, Card, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


export default function OrderCard({ data }) {
  const result = (value) => {
    const parts = value.toString().split('.');
    if (parts.length === 2 && (parts[1] === '00' || parts[1] === '0')) {
      return Math.floor(parseFloat(value)).toString();
    }
    return value.toString();
  }

  console.log('OrderCard', data)


  return (
    <Link to={`/home/order-details/${data.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

      <Card
        style={{
          height: '100%',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box style={{
          padding: '10px',

        }}>
          <Typography variant="subtitle1">Order No. {data.id}</Typography>
          <Box mt={1}>
            <Typography variant="h6">{data.mill.name}</Typography>
            <Typography variant="subtitle2" color="textSecondary">{`${data.mill.location} (${data.mill.state.name})`}</Typography>
          </Box>
        </Box>
        <Divider />
        <Box  pt={1}>
          <Box style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                }}>
            <Typography variant="subtitle1">{data.product.product_type.product_type}</Typography>
            <Typography variant="subtitle1">{data.product.code}</Typography>
            <Typography variant="subtitle1">{data.sold}</Typography>
            <Typography variant="subtitle1">{`${parseFloat(data.qty).toFixed(2)} ${data.product.product_type.unit}`}</Typography>
          </Box>
          <Table>
            <TableBody sx={{p:0}}>
              {data.product.properties.map((property, index) => (
                <TableRow key={index}>
                  <TableCell>{property.label}</TableCell>
                  <TableCell>{property.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Link>
  );
}

OrderCard.propTypes = {
  data: PropTypes.any,
};
