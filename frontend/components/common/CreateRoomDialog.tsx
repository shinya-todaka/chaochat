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
import Link from 'next/link';
import { TwitterIcon } from 'components/common/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  formControl: {
    margin: '10px',
  },
  linkRoom: {
    textDecoration: 'none',
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
      <DialogTitle>ルームの名前を設定しますか？</DialogTitle>
      <FormControl className={classes.formControl}>
        <RadioGroup row className={classes.formControl}>
          <FormControlLabel
            control={<Radio />}
            label="いいえ"
            checked={!isNeedRoomName}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Radio />}
            label="はい"
            checked={isNeedRoomName}
            onChange={handleChange}
          />
        </RadioGroup>
      </FormControl>
      <DialogContent hidden={!isNeedRoomName}>
        <TextField
          margin="dense"
          label="ルーム名"
          onChange={({ target: { value } }) => setName(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => completion(name)} disabled={!isEnableCreate()}>
          ルームを作成
        </Button>
      </DialogActions>
    </>
  );
};

const Complete: FC<{ roomId: string }> = ({ roomId }) => {
  const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${roomId}`;
  const classes = useStyles();
  const handleWriteToClipboard = async () => {
    await navigator.clipboard.writeText(roomUrl);
  };
  const handleTweet = () => {
    const encodedUri = encodeURI(roomUrl);
    const uri = `https://twitter.com/intent/tweet?url=${encodedUri}`;
    if (!window.open(uri)) window.location.href = uri;
  };

  return (
    <>
      <DialogTitle>ルームの作成に成功しました！</DialogTitle>
      <DialogContent>
        <Link href={roomUrl}>
          <a className={classes.linkRoom}>ルームに移動する</a>
        </Link>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<TwitterIcon />} onClick={handleTweet}>
          ツイートする
        </Button>
        <Button onClick={handleWriteToClipboard}>urlをコピー</Button>
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
        <Complete roomId={roomId} />
      ) : (
        <CreateRoom completion={createRoomCompletion} />
      )}
    </Dialog>
  );
};

export default CreateRoomDialog;
