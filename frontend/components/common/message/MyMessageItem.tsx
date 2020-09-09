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
    maxWidth: '60%',
    padding: '8px',
    borderColor: theme.palette.primary.main,
    border: 'solid',
    borderWidth: '1px',
    borderRadius: '4px',
    fontSize: '14px',
    overflowWrap: 'break-word',
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
