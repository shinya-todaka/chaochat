import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Message } from 'models/message';

const useStyles = makeStyles({
  myMessageItem: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginTop: '6px',
    marginRight: '4px',
    paddingRight: '10px',
  },
  messageBubble: {
    width: 'auto',
    maxWidth: '60%',
    padding: '8px',
    border: 'solid',
    borderWidth: '1px',
    borderRadius: '4px',
    fontSize: '14px',
    overflowWrap: 'break-word',
  },
});

const MyMessageItem: FC<{ message: Message }> = ({ message }) => {
  const classes = useStyles();

  return (
    <div className={classes.myMessageItem}>
      <div className={classes.messageBubble}>{message.text}</div>
    </div>
  );
};

export default MyMessageItem;
