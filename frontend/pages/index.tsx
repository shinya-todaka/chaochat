import Box from '@material-ui/core/Box';
import AppHeader from 'components/common/header/AppBar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import { useUser } from 'contexts/UserContext';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Room } from 'models/room';
import { Member } from 'models/member';
import { TwitterIcon } from 'components/common/icons';
import CreateRoomDialog from 'components/common/CreateRoomDialog';
import writeRoom from 'services/write-room';

const useStyles = makeStyles({
  title: {
    margin: '30px',
  },
});

const Index: NextPage = () => {
  const classes = useStyles();
  const { user, loadingUser } = useUser();
  const handleSignin = async () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateRoom = async (
    name: string | null,
  ): Promise<string | null> => {
    if (user) {
      const room: Room = { name, members: [user.id] };
      const member: Member = {
        displayName: user.displayName,
        photoUrl: user.photoUrl,
        isEnabled: true,
        createdAt: null,
      };
      const roomId = await writeRoom(user.id, member, room);

      return roomId;
    }

    return null;
  };

  return (
    <>
      <AppHeader loadingUser={loadingUser} user={user} />
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" justifyContent="center" className={classes.title}>
          <Typography variant="h2">ChaoChat</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          {user ? (
            <Button variant="outlined" onClick={handleOpen}>
              Create Room
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              onClick={handleSignin}
            >
              Signin using Twitter
            </Button>
          )}
        </Box>
        <CreateRoomDialog
          open={open}
          handleClose={handleClose}
          handleCreateRoom={handleCreateRoom}
        />
      </Box>
    </>
  );
};

export default Index;
