import React, { FC, useState } from 'react';
import {
  Dialog,
  FormControl,
  RadioGroup,
  FormControlLabel,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Radio,
  MobileStepper,
} from '@material-ui/core';
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
  handleSetRoomName: (name: string | null) => void;
}> = ({ handleSetRoomName }) => {
  const classes = useStyles();
  const [roomName, setRoomName] = useState<string>('');
  const [isNeedRoomName, setIsNeedRoomName] = useState(false);

  const roomNameValidator = (text: string) =>
    text.length > 0 && text.length < 30;

  const isEnableCreate = (): boolean => {
    return !isNeedRoomName || roomNameValidator(roomName);
  };

  const handleChangeIsNeeedRoomName = (isNeed: boolean) => {
    if (isNeed) {
      setIsNeedRoomName(isNeed);
      console.log('is need!!');
    } else {
      setRoomName('');
      setIsNeedRoomName(isNeed);
      console.log('is not need');
    }
  };

  const handlePush = (_roomName: string | null) => {
    handleSetRoomName(_roomName);
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
            onChange={() => handleChangeIsNeeedRoomName(false)}
          />
          <FormControlLabel
            control={<Radio />}
            label="はい"
            checked={isNeedRoomName}
            onChange={() => handleChangeIsNeeedRoomName(true)}
          />
        </RadioGroup>
      </FormControl>
      <DialogContent hidden={!isNeedRoomName}>
        <TextField
          label="ルーム名"
          onChange={({ target: { value } }) => setRoomName(value)}
          value={roomName}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handlePush(roomName)}
          disabled={!isEnableCreate()}
          color="primary"
          variant="outlined"
        >
          次へ
        </Button>
      </DialogActions>
    </>
  );
};

const SetExpiresIn: FC<{
  handlePop: () => void;
  handleCreateRoom: (_expiresIn: 3 | 5 | 10 | 15) => void;
}> = ({ handlePop, handleCreateRoom }) => {
  const classes = useStyles();
  const [expiresIn, setExpiresIn] = useState<3 | 5 | 10 | 15>(5);
  const handleChangeExpiresIn = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setExpiresIn(
      parseInt((event.target as HTMLInputElement).value, 10) as 3 | 5 | 10 | 15,
    );
  };

  return (
    <>
      <DialogContent>
        <Box fontWeight="fontWeightBold">ルームの制限時間を決めよう</Box>
      </DialogContent>
      <FormControl className={classes.formControl}>
        <RadioGroup row={false} onChange={handleChangeExpiresIn}>
          {[3, 5, 10, 15].map((value) => {
            return (
              <FormControlLabel
                key={value}
                control={<Radio />}
                value={value}
                label={`${value}分`}
                checked={expiresIn === value}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <DialogActions>
        <Button onClick={() => handlePop()}>前へ</Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleCreateRoom(expiresIn)}
        >
          作成
        </Button>
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
  const [roomName, setRoomNme] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<0 | 1>(0);

  const handleSetRoomName = (_roomName: string | null) => {
    setRoomNme(_roomName);
    setCurrentPage(1);
  };
  const handlePop = () => {
    if (currentPage === 1) {
      setCurrentPage((currentPage - 1) as 0);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
    >
      {currentPage === 0 && (
        <CreateRoom handleSetRoomName={handleSetRoomName} />
      )}
      {currentPage === 1 && (
        <SetExpiresIn
          handlePop={handlePop}
          handleCreateRoom={(_expiresIn) =>
            handleCreateRoom(roomName, _expiresIn)
          }
        />
      )}
    </Dialog>
  );
};

export default CreateRoomDialog;
