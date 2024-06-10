import {
  Avatar,
  Stack,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Label from 'src/components/label';
import { selectSellerData } from 'src/redux/actions/update-seller-action';
import { useRouter } from 'src/routes/hooks';
import { useUserTableFormat } from '../use-sellers-table-formate';

export default function UserTableRow({
  name,
  status,
  gstno,
  phoneNumber,
  email,
  mills,
  row,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { getStatusColor } = useUserTableFormat();
  const router = useRouter();
  const dispatch = useDispatch();


  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleSellerUpdate = (seller) => {
    dispatch(selectSellerData(seller));

    router.replace('/home/sellers-view/add-users');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
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
          onClick={() => handleSellerUpdate(row)} component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src="avatarUrl" />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        {/* <TableCell>{gstno}</TableCell> */}
        <TableCell
          onMouseEnter={(e) => {
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => handleCall(phoneNumber)}>{phoneNumber}</TableCell>
        {/* <TableCell
            onMouseEnter={(e) => {
              e.currentTarget.style.borderRadius = '8px';
              e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            >{email}</TableCell> */}
        <TableCell>
          <Label >{status}</Label>
        </TableCell>
        {/* <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell> */}
      </TableRow>
    </>
  );
}


UserTableRow.propTypes = {
  name: PropTypes.any,
  status: PropTypes.any,
  gstno: PropTypes.any,
  phoneNumber: PropTypes.any,
  email: PropTypes.any,
  mills: PropTypes.any,
  row: PropTypes.any,
};
