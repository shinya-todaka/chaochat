import React, { FC } from 'react';
import { IMessage } from 'models/message';
import MyMessageItem from 'components/common/message/MyMessageItem';
import OthersMessageItem from 'components/common/message/OthersMessageItem';

const MessageItem: FC<{
  roomId: string;
  isMyMesssage: boolean;
  message: IMessage;
}> = ({ isMyMesssage, message }) => {
  return isMyMesssage ? (
    <MyMessageItem message={message} />
  ) : (
    <OthersMessageItem message={message} />
  );
};

export default MessageItem;
