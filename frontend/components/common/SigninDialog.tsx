import React, { FC } from 'react';
import 'firebase/auth';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const SigninDialog: FC<{
  open: boolean;
  onClose: () => void;
  signin: () => void;
}> = ({ open, onClose, signin }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ルームに入るためにサインインしてください。</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={signin}>サインイン</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SigninDialog;
