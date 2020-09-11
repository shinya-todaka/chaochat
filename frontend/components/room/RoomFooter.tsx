import React, { FC } from 'react';
import Input from 'components/common/footer/Input';
import JoinRoomFooter from 'components/common/footer/JoinRoomFooter';
import { IRoom } from 'models/room';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  link: {
    textDecoration: 'none',
    fontSize: 18,
  },
}));

const RoomFooter: FC<{
  isInRoom: boolean;
  room: IRoom;
  sendMessage: (text: string) => void;
  handleJoin: (anonymously: boolean) => void;
}> = ({ isInRoom, room, sendMessage, handleJoin }) => {
  const classes = useStyles();
  if (room.isClosed) {
    return (
      <Paper elevation={2} className={classes.root}>
        <Box
          display="flex"
          justifyContent="justifyContent"
          alignItems="center"
          flexDirection="column"
          p={2}
        >
          <Box>
            <Typography variant="h6">このルームは終了しました</Typography>
            <Box height={8} />
            <Link href="/">
              <Button variant="contained" fullWidth>
                <a className={classes.link}>ホームに戻る</a>
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    );
  }

  if (isInRoom) {
    return <Input sendMessage={sendMessage} />;
  }

  return <JoinRoomFooter room={room} onClickJoin={handleJoin} />;
};

export default RoomFooter;
