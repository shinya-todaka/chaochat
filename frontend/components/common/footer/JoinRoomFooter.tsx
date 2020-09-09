import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { IRoom } from 'models/room';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  margin: {
    margin: '6px',
  },
}));

const JoinRoomFooter: FC<{
  room: IRoom;
  onClickJoin: (anonymously: boolean) => void;
}> = ({ room, onClickJoin }) => {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.root}>
      <Box display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" padding="16px">
          {room.name && (
            <Box fontWeight="fontWeightBold" textAlign="center" fontSize={20}>
              {room.name}
            </Box>
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
    </Paper>
  );
};

export default JoinRoomFooter;
