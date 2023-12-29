import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

export default function AlertDialog({ content, isDialogOpen, handleConfirm, handleClose }) {
  return (
    <Dialog open={isDialogOpen} onClose={handleClose}>
      <DialogTitle>Alert</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={handleConfirm}>Confirm</LoadingButton>
        <LoadingButton   sx={{ color: 'error.main' }}  onClick={handleClose}>Cancel</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  content: PropTypes.any,
  isDialogOpen: PropTypes.bool,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};
