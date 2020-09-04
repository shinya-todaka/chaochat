import React, { FC, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { User } from 'models/user';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  wrapper: {
    margin: '1',
    position: 'relative',
  },
  iconButton: {
    alignItems: 'center',
  },
  circular: {
    color: '#fff',
  },
});

const RightBarItem: FC<{ loadingUser: boolean; user: User }> = ({
  loadingUser,
  user,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);
  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = () => {
    setAnchorEl(buttonRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    setAnchorEl(null);
    firebase.auth().signOut();
  };

  const handleSignin = () => {
    firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider());
  };

  if (loadingUser) {
    return <CircularProgress size={34} className={classes.circular} />;
  }

  if (user?.photoUrl) {
    return (
      <Box>
        <IconButton onClick={handleClick} ref={buttonRef} size="small">
          <Avatar
            src={user.photoUrl}
            style={{
              width: '34px',
              height: '34px',
            }}
          />
        </IconButton>

        <Menu
          id="account-menu"
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          color="inherit"
        >
          <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Button color="inherit" onClick={handleSignin}>
      <Typography>Sign In</Typography>
    </Button>
  );
};

export default RightBarItem;
