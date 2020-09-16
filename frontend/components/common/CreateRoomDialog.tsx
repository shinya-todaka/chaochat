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
  Box,
  Radio,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'contexts/SnackBarContext';
import Link from 'next/link';
import { TwitterIcon } from 'components/common/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 'bold',
  },
  formControl: {
    padding: '18px',
  },
  linkRoom: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    fontSize: 14,
  },
}));

const CreateRoom: FC<{
  completion: (name: string | null, expiresIn: 3 | 5 | 10 | 15) => void;
}> = ({ completion }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [expiresIn, setExpiresIn] = useState<3 | 5 | 10 | 15>(5);
  const [isNeedRoomName, setIsNeedRoomName] = useState(false);

  const handleChangeExpiresIn = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setExpiresIn(
      parseInt((event.target as HTMLInputElement).value, 10) as 3 | 5 | 10 | 15,
    );
  };

  const roomNameValidator = (text: string) =>
    text.length > 0 && text.length < 30;

  const isEnableCreate = (): boolean => {
    return !isNeedRoomName || roomNameValidator(name);
  };

  const handleCreateRoom = () => {
    completion(isNeedRoomName ? name : null, expiresIn);
  };

  return (
    <>
      <DialogContent>
        <Box fontWeight="fontWeightBold">ルームの名前を設定しますか？</Box>
      </DialogContent>
      <FormControl className={classes.formControl}>
        <RadioGroup row>
          <FormControlLabel
            control={<Radio />}
            label="いいえ"
            checked={!isNeedRoomName}
            onChange={() => setIsNeedRoomName(false)}
          />
          <FormControlLabel
            control={<Radio />}
            label="はい"
            checked={isNeedRoomName}
            onChange={() => setIsNeedRoomName(true)}
          />
        </RadioGroup>
      </FormControl>
      <DialogContent hidden={!isNeedRoomName}>
        <TextField
          label="ルーム名"
          onChange={({ target: { value } }) => setName(value)}
        />
      </DialogContent>
      <DialogContent>
        <Box fontWeight="fontWeightBold">ルームの制限時間を決めよう</Box>
      </DialogContent>
      <FormControl className={classes.formControl}>
        <RadioGroup row={false} onChange={handleChangeExpiresIn}>
          <FormControlLabel
            control={<Radio />}
            value={3}
            label="3分"
            checked={expiresIn === 3}
          />
          <FormControlLabel
            control={<Radio />}
            value={5}
            label="5分"
            checked={expiresIn === 5}
          />
          <FormControlLabel
            control={<Radio />}
            value={10}
            label="10分"
            checked={expiresIn === 10}
          />
          <FormControlLabel
            control={<Radio />}
            value={15}
            label="15分"
            checked={expiresIn === 15}
          />
        </RadioGroup>
      </FormControl>
      <DialogActions>
        <Button
          onClick={handleCreateRoom}
          disabled={!isEnableCreate()}
          color="primary"
          variant="outlined"
        >
          作成
        </Button>
      </DialogActions>
    </>
  );
};

const Complete: FC<{ roomId: string; expiresIn: 3 | 5 | 10 | 15 }> = ({
  roomId,
  expiresIn,
}) => {
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
      <DialogContent>{`* ${expiresIn}分間チャットができます。 `}</DialogContent>
      <DialogContent>
        <Link href={roomUrl}>
          <a className={classes.linkRoom}>
            <Button variant="contained" color="primary" disableElevation>
              ルームに移動する
            </Button>
          </a>
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
  handleCreateRoom: (
    name: string | null,
    expiresIn: 3 | 5 | 10 | 15,
  ) => Promise<string | null>;
}> = ({ open, handleClose, handleCreateRoom }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<3 | 5 | 10 | 15>(5);

  const createRoomCompletion = async (
    name: string | null,
    theExpiresIn: 3 | 5 | 10 | 15,
  ) => {
    try {
      const theRoomId = await handleCreateRoom(name, expiresIn);
      setRoomId(theRoomId);
      setExpiresIn(theExpiresIn);
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
        <Complete roomId={roomId} expiresIn={expiresIn} />
      ) : (
        <CreateRoom completion={createRoomCompletion} />
      )}
    </Dialog>
  );
};

export default CreateRoomDialog;
