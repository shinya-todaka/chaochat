import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Radio,
} from '@material-ui/core';
import { TwitterIcon } from 'components/common/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  formControl: {
    margin: '10px',
  },
});

const CreateRoom: FC<{
  completion: (name: string) => void;
}> = ({ completion }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [isNeedRoomName, setIsNeedRoomName] = useState(false);

  const handleChange = () => {
    setIsNeedRoomName(!isNeedRoomName);
  };

  const roomNameValidator = (text: string) =>
    text.length > 0 && text.length < 30;

  const isEnableCreate = (): boolean => {
    return !isNeedRoomName || roomNameValidator(name);
  };

  return (
    <>
      <DialogTitle>set roon name?</DialogTitle>
      <FormControl className={classes.formControl}>
        <RadioGroup row className={classes.formControl}>
          <FormControlLabel
            control={<Radio />}
            label="no"
            checked={!isNeedRoomName}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Radio />}
            label="yes"
            checked={isNeedRoomName}
            onChange={handleChange}
          />
        </RadioGroup>
      </FormControl>
      <DialogContent hidden={!isNeedRoomName}>
        <TextField
          margin="dense"
          label="Room Name"
          onChange={({ target: { value } }) => setName(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => completion(name)} disabled={!isEnableCreate()}>
          Create Room
        </Button>
      </DialogActions>
    </>
  );
};

const TweetInvitation: FC<{ roomId: string }> = ({ roomId }) => {
  const HOST = process.env.NEXT_PUBLIC_HOST;

  return (
    <>
      <DialogTitle>Success create room!</DialogTitle>
      <DialogContent>
        <DialogContentText>id: {roomId}</DialogContentText>
        <DialogContentText>{`url: ${HOST}/rooms/${roomId}`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<TwitterIcon />}>Tweet</Button>
      </DialogActions>
    </>
  );
};

const CreateRoomDialog: FC<{
  open: boolean;
  handleClose: () => void;
  handleCreateRoom: (name: string) => Promise<string | null>;
}> = ({ open, handleClose, handleCreateRoom }) => {
  const [roomId, setRoomId] = useState<string | null>(null);

  const createRoomCompletion = async (name: string) => {
    try {
      const theRoomId = await handleCreateRoom(name);
      setRoomId(theRoomId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
    >
      {roomId ? (
        <TweetInvitation roomId={roomId} />
      ) : (
        <CreateRoom completion={createRoomCompletion} />
      )}
    </Dialog>
  );
};

export default CreateRoomDialog;
