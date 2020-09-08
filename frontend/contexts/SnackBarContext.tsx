import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  FC,
} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';

type SnackbarContextValue = {
  showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextValue>({
  showSnackbar: () => undefined,
});

const useStyles = makeStyles((theme) => ({
  snackbar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const SnackbarProvider: FC<{ children: any }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const showSnackbar = (theMessage: string) => {
    setMessage(theMessage);
    setOpen(true);
  };

  return (
    <>
      <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}
      </SnackbarContext.Provider>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          {message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default SnackbarProvider;

export const useSnackbar = () => useContext(SnackbarContext);
