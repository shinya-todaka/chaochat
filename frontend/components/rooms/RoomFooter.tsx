import React, { FC } from 'react';
import Input from 'components/common/footer/Input';
import JoinRoomFooter from 'components/common/footer/JoinRoomFooter';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { Room } from 'services/chaos/models/room';

const RoomFooter: FC<{
  isInitialFetching: boolean;
  isInRoom: boolean;
  room: Room;
  sendMessage: (text: string) => void;
  handleJoin: (anonymously: boolean) => void;
}> = ({ isInitialFetching, isInRoom, room, sendMessage, handleJoin }) => {
  if (isInitialFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  if (isInRoom) {
    return <Input sendMessage={sendMessage} />;
  }

  return <JoinRoomFooter room={room} onClickJoin={handleJoin} />;
};

export default RoomFooter;
