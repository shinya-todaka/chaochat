import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IMessage } from 'models/message';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  myMessageItem: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginTop: '6px',
    marginRight: '4px',
    paddingRight: '10px',
  },
  messageBubble: {
    width: 'auto',
    minWidth: '30px',
    maxWidth: '60%',
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    backgroundColor: '#E7ECF0',
    color: '#000',
    borderRadius: '20px',
    fontSize: '14px',
    wordWrap: 'break-word',
  },
}));

const MyMessageItem: FC<{ message: IMessage }> = ({ message }) => {
  const classes = useStyles();

  return (
    <Box className={classes.myMessageItem}>
      <Box className={classes.messageBubble}>{message.text}</Box>
    </Box>
  );
};

export default MyMessageItem;
