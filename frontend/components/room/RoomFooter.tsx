import React, { FC } from 'react';
import Input from 'components/common/footer/Input';
import JoinRoomFooter from 'components/common/footer/JoinRoomFooter';
import RoomClosedFooter from 'components/common/footer/RoomClosedFooter';
import { IRoom } from 'models/room';

const RoomFooter: FC<{
  isInRoom: boolean;
  room: IRoom;
  sendMessage: (text: string) => void;
  handleJoin: (anonymously: boolean) => void;
}> = ({ isInRoom, room, sendMessage, handleJoin }) => {
  if (room.isClosed) {
    return <RoomClosedFooter />;
  }

  if (isInRoom) {
    return <Input sendMessage={sendMessage} />;
  }

  return <JoinRoomFooter room={room} onClickJoin={handleJoin} />;
};

export default RoomFooter;
