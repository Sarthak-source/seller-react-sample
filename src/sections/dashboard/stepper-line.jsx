import StepConnector from '@mui/material/StepConnector';
import { withStyles } from '@mui/styles';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)"
  },
  active: {
    "& $line": {
      borderColor: 'rgba(77, 182, 172, 0.9)',
      borderTopWidth: 3,
    }
  },
  completed: {
    "& $line": {
      borderColor: 'rgba(77, 182, 172, 0.9)',
      borderTopWidth: 3,
    }
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  }
})(StepConnector);

export { QontoConnector };
