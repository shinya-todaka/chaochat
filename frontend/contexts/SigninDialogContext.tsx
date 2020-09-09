import { createContext, useState, useCallback, useContext, FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/auth';

type SigninDialogContextValue = {
  onAuthStateChanged: (isAuthenticated: boolean, loading: boolean) => void;
};

const SigninDialogContext = createContext<SigninDialogContextValue>({
  onAuthStateChanged: () => undefined,
});

const SigninDialogProvider: FC<{ children: any; title: string }> = ({
  children,
  title,
}) => {
  const [open, setOpen] = useState(false);

  const handleSignin = useCallback(() => {
    firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider());
  }, []);

  const onAuthStateChanged = useCallback(
    (isAuthenticated: boolean, loading: boolean) => {
      if (loading) {
        setOpen(false);
      } else if (!isAuthenticated) {
        setOpen(true);
      }
    },
    [],
  );

  return (
    <>
      <SigninDialogContext.Provider value={{ onAuthStateChanged }}>
        {children}
      </SigninDialogContext.Provider>
      <Dialog open={open}>
        <DialogTitle>
          <Typography>{title}</Typography>
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleSignin} color="primary">
            ログイン
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SigninDialogProvider;

export const useAuthDialog = () => useContext(SigninDialogContext);
