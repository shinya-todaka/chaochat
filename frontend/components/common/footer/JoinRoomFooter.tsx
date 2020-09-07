import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { IRoom } from 'models/room';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  margin: {
    margin: '6px',
  },
});

const JoinRoomFooter: FC<{
  room: IRoom;
  onClickJoin: (anonymously: boolean) => void;
}> = ({ room, onClickJoin }) => {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="center" bgcolor="#6b8d8e">
      <Box display="flex" flexDirection="column" padding="16px">
        {room.name && (
          <Typography className={classes.margin} align="center">
            ルーム名 {room.name}
          </Typography>
        )}

        <Box display="flex" flexDirection="column">
          <Button
            variant="contained"
            onClick={() => onClickJoin(true)}
            className={classes.margin}
          >
            とくめいで参加する
          </Button>
          <Button
            variant="contained"
            onClick={() => onClickJoin(false)}
            className={classes.margin}
          >
            ツイッターのプロフィールで参加する
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default JoinRoomFooter;
