import React, { FC } from 'react';
import { IMessage } from 'models/message';
import MessageItem from 'components/common/message/MessageItem';
import Box from '@material-ui/core/Box';

const MessageList: FC<{
  roomId: string;
  uid: string;
  messages: IMessage[];
}> = ({ roomId, uid, messages }) => {
  return (
    <>
      {messages.map((message) => {
        return (
          <MessageItem
            roomId={roomId}
            isMyMesssage={uid === message.from}
            message={message}
            key={message.id}
          />
        );
      })}
    </>
  );
};

export default MessageList;
