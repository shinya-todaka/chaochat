import React, { FC } from 'react';
import { Message } from 'models/message';
import MyMessageItem from 'components/common/message/MyMessageItem';
import OthersMessageItem from 'components/common/message/OthersMessageItem';

const MessageItem: FC<{
  roomId: string;
  isMyMesssage: boolean;
  message: Message;
}> = ({ roomId, isMyMesssage, message }) => {
  return isMyMesssage ? (
    <MyMessageItem message={message} />
  ) : (
    <OthersMessageItem roomId={roomId} message={message} />
  );
};

export default MessageItem;
