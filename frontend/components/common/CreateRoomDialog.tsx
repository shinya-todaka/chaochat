import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Radio,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'contexts/SnackBarContext';
import Link from 'next/link';
import { TwitterIcon } from 'components/common/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: '10px',
  },
  linkRoom: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
  },
}));

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
      <DialogTitle>
        <Typography variant="subtitle1">
          ルームの名前を設定しますか？
        </Typography>
      </DialogTitle>
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
          label="ルーム名"
          onChange={({ target: { value } }) => setName(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => completion(name)}
          disabled={!isEnableCreate()}
          color="secondary"
          variant="outlined"
        >
          作成
        </Button>
      </DialogActions>
    </>
  );
};

const Complete: FC<{ roomId: string }> = ({ roomId }) => {
  const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${roomId}`;
  const classes = useStyles();
  const { showSnackbar } = useSnackbar();
  const handleWriteToClipboard = async () => {
    await navigator.clipboard.writeText(roomUrl);
    showSnackbar('urlをコピーしました!');
  };

  const handleTweet = () => {
    const encodedUri = encodeURI(roomUrl);
    const uri = `https://twitter.com/intent/tweet?url=${encodedUri}`;
    window.open(uri);
  };

  return (
    <>
      <DialogTitle>
        <Typography variant="subtitle1">
          ルームの作成に成功しました！
        </Typography>
      </DialogTitle>
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
