import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectState } from 'src/redux/actions/state-refresh';

/**
 * A customizable alert dialog component that displays a message and allows
 * the user to confirm or cancel an action.
 * Uses Material-UI components for styling and functionality.
 * @param {object} props - Component props
 * @param {string|React.ReactNode} props.content - Content to display in the dialog.
 * @param {boolean} props.isDialogOpen - Controls the visibility of the dialog.
 * @param {function} props.handleConfirm - Function to execute on confirmation.
 * @param {boolean} [props.runConfirm=true] - Flag to determine if confirmation logic should run.
 * @param {boolean} [props.shouldDispatch=true] - Flag to determine if Redux dispatch should occur after confirmation.
 * @param {function} props.handleClose - Function to handle closing the dialog.
 * @returns {JSX.Element}
 */
export default function AlertDialog({ content, isDialogOpen, handleConfirm, runConfirm = true, handleClose, shouldDispatch = true }) {
  const dispatch = useDispatch();
  const currentState = useSelector((state) => state.stateRefreash.currentState);
  const [loading, setLoading] = useState(false);

  /**
   * Handles the action when the Confirm button is clicked.
   * Executes the handleConfirm function, waits for a delay (if enabled),
   * and dispatches a Redux action based on the shouldDispatch flag.
   */

  const handleAction = async () => {
    try {
      setLoading(true);
      handleConfirm();
      // If runConfirm is enabled, simulate a delay (for demonstration) and dispatch Redux action
      if (runConfirm) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        if (shouldDispatch) {
          dispatch(selectState(!currentState));
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleClose}>
      <DialogTitle>Alert</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={loading} onClick={handleAction}>Confirm</LoadingButton>
        <LoadingButton sx={{ color: 'error.main' }} onClick={handleClose}>Cancel</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  content: PropTypes.any,
  isDialogOpen: PropTypes.bool,
  handleConfirm: PropTypes.func,
  shouldDispatch: PropTypes.bool,
  handleClose: PropTypes.func,
  runConfirm: PropTypes.bool,
};
