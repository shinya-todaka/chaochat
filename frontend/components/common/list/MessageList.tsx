import React, { FC, useRef } from 'react';
import { IMessage } from 'models/message';
import MessageItem from 'components/common/message/MessageItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
    flex: 'auto',
    marginBottom: '90px',
    paddingRight: '4px',
    paddingLeft: '4px',
  },
}));

const MessageList: FC<{
  roomId: string;
  uid: string;
  messages: IMessage[];
}> = ({ roomId, uid, messages }) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={classes.root} id="scroll-area">
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
    </div>
  );
};

export default MessageList;
