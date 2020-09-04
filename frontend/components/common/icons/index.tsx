import React, { FC } from 'react';
import Twitter from '@material-ui/icons/Twitter';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  twitter: {
    color: ' #1DA1F2',
  },
});

const TwitterIcon: FC = () => {
  const classes = useStyles();

  return <Twitter className={classes.twitter} />;
};

export { TwitterIcon };
