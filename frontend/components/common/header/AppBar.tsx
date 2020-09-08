import React, { FC } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core';
import RightBarItem from 'components/common/header/RightBarButtonItem';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
import { User } from 'models/user';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50px',
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
  },
  homeLink: {
    color: '#ffff',
    textDecoration: 'none',
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
          <Link href="/">
            <a className={classes.homeLink}>
              <Typography variant="h6">chaochat</Typography>
            </a>
          </Link>
          <Box flexGrow={1} />
          <RightBarItem loadingUser={loadingUser} user={user} />
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default Header;
