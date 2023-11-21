import { Box, Card, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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
            <Typography variant="subtitle3" color="textSecondary">{`${data.mill.location} (${data.mill.state.name})`}</Typography>
          </Box>
        </Box>
        <Divider />
        <Box>
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
                  {data.product.properties.map((property, index) => (
                    <TableCell>{property.label}</TableCell>
                  ))}
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
                    {data.sold === null ? data.sold : 'None' }
                  </TableCell>
                  <TableCell>

                    {parseFloat(data.qty).toFixed(2)} {data.product.product_type.unit}

                  </TableCell>
                  {data.product.properties.map((property, index) => (
                    <TableCell>{property.value}</TableCell>
                  ))}
                </TableRow>

                {/* Add more rows if needed */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Link>
  );
}

OrderCard.propTypes = {
  data: PropTypes.any,
};
