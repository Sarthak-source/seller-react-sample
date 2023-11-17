import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function TenderCard({ data }) {
  console.log('data',data)
  return (
    <Card sx={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      margin: '10px',
    }}>
      <div style={{ backgroundColor: '#E0F2F1', padding: '10px' }}>
        <Typography variant="subtitle1">{`Tender No. ${data.id}`}</Typography>
        <div style={{ display: 'flex', aligndatas: 'center' }}>
          <div style={{
            backgroundColor: 'blueGrey',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            aligndatas: 'center',
            color: 'white',
            fontSize: '20px',
          }}>
            {data.mill.name.charAt(0)}
          </div>
          <div style={{ marginLeft: '10px' }}>
            <Typography variant="h6">{data.mill.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">{`${data.mill.location} (${data.mill.state.name})`}</Typography>
            {/* Add other details as needed */}
          </div>
        </div>
      </div>
      <div style={{ borderBottom: '1px solid blueGrey' }}/>
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1">{data.product.product_type.product_type}</Typography>
          <Typography variant="subtitle1">{data.product.code}</Typography>
          <Typography variant="subtitle1">{data.sold}</Typography>
          <Typography variant="subtitle1">{`${parseFloat(data.qty).toFixed(2)} ${data.product.product_type.unit}`}</Typography>
        </div>
        <Table>
          <TableBody>
            {data.product.properties.map((property, index) => (
              <TableRow key={index}>
                <TableCell>{property.label}</TableCell>
                <TableCell>{property.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Add other JSX elements */}
    </Card>
  );
}

TenderCard.propTypes = {
  data: PropTypes.any,
};

