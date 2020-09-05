import React, { FC } from 'react';
import Input from 'components/common/footer/Input';
import JoinRoomFooter from 'components/common/footer/JoinRoomFooter';
import { Room } from 'models/room';

const RoomFooter: FC<{
  isInRoom: boolean;
  room: Room;
  sendMessage: (text: string) => void;
  handleJoin: (anonymously: boolean) => void;
}> = ({ isInRoom, room, sendMessage, handleJoin }) => {
  if (isInRoom) {
    return <Input sendMessage={sendMessage} />;
  }

  return <JoinRoomFooter room={room} onClickJoin={handleJoin} />;
};

export default RoomFooter;
