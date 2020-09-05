import React, { FC } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { Typography, makeStyles } from '@material-ui/core';
import RightBarItem from 'components/common/header/RightBarButtonItem';
import Box from '@material-ui/core/Box';
import { User } from 'models/user';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50px',
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
  },
}));

const Header: FC<{ loadingUser: boolean; user: User | null }> = ({
  loadingUser,
  user,
}) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root} elevation={0}>
      <ToolBar variant="dense">
        <Box display="flex" flexGrow={1} alignItems="center">
          <Typography variant="h6">chaochat</Typography>
          <Box flexGrow={1} />
          <RightBarItem loadingUser={loadingUser} user={user} />
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default Header;
