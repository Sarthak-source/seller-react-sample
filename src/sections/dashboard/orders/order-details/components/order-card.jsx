import { Box, Card, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Label from 'src/components/label/label';
import { useOrderTableFormate } from '../../use-order-table-formate';


export default function OrderCard({ data }) {
  const result = (value) => {
    const parts = value.toString().split('.');
    if (parts.length === 2 && (parts[1] === '00' || parts[1] === '0')) {
      return Math.floor(parseFloat(value)).toString();
    }
    return value.toString();
  }

  console.log('data.tender_head', data)

  const { getStatusColor, getStatusText } = useOrderTableFormate();


  return (
   

      <Card
        style={{
          height: '100%',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box style={{
          padding: '10px',

        }}>
          <Typography variant="subtitle1" >Tender No. {data.tender_head.id}</Typography>

          <Box
            display="flex" justifyContent="space-between" pt={1}
          >
            <Typography variant="h6" color="primary.main">{data.tender_head.mill.name}</Typography>
            <Typography variant="subtitle1" >Order No. {data.id}</Typography>
           
          </Box>

          <Box mt={1} display="flex" justifyContent="space-between">

            <Typography variant="subtitle1" color="textSecondary" mt={1}>{`${data.tender_head.mill.location} (${data.tender_head.mill.state.name})`}</Typography>
            <Label color={getStatusColor(getStatusText(data.status))}>{getStatusText(data.status)}</Label>
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
                  {data.tender_head.product.properties.map((property, index) => (
                    <TableCell>{property.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>

                    {data.tender_head.product.product_type.product_type}

                  </TableCell>
                  <TableCell>
                    {data.tender_head.product.code}
                  </TableCell>
                  <TableCell>
                    {data.dispatched_qty} {data.tender_head.product.product_type.unit}
                  </TableCell>
                  <TableCell>

                    {parseFloat(data.tender_head.qty).toFixed(2)} {data.tender_head.product.product_type.unit}

                  </TableCell>
                  {data.tender_head.product.properties.map((property, index) => (
                    <TableCell>{property.value}</TableCell>
                  ))}
                </TableRow>

                {/* Add more rows if needed */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
   
  );
}

OrderCard.propTypes = {
  data: PropTypes.any,
};
