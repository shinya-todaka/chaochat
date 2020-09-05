import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import useInput from 'hooks/ui/useInput';

const SetAnonyMousMemberDialog: FC<{
  open: boolean;
  onClose: () => void;
  onClickCreate: (text: string) => void;
}> = ({ open, onClose, onClickCreate }) => {
  const { text, isValid, onChange } = useInput((_text) => !!_text);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>名前を決めてください</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="名前"
          onChange={({ target }) => onChange(target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!isValid} onClick={() => onClickCreate(text)}>
          参加する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetAnonyMousMemberDialog;
