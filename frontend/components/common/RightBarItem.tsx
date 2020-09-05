import React, { FC, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

const RightBarItem: FC<{ photoUrl?: string }> = ({ photoUrl }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);

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
    firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider());
  };

  return photoUrl ? (
    <Box>
      <IconButton onClick={handleClick} ref={buttonRef} size="small">
        <Avatar
          src={photoUrl}
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
  ) : (
    <Button color="inherit" onClick={handleSignin}>
      <Typography>Sign In</Typography>
    </Button>
  );
};

export default RightBarItem;
