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
import { ORoom } from 'models/room';
import { OMember } from 'models/member';
import { TwitterIcon } from 'components/common/icons';
import CreateRoomDialog from 'components/common/CreateRoomDialog';
import writeRoom from 'services/write-room';
import SnackbarProvider from 'contexts/SnackBarContext';

const useStyles = makeStyles({
  title: {
    margin: '30px',
  },
});

const Index: NextPage = () => {
  const classes = useStyles();
  const { user } = useUser();
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
      const room: ORoom = {
        name,
        members: [user.id],
        expiresIn: 1,
        isClosed: false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const member: OMember = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        isEnabled: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const roomId = await writeRoom(user.id, member, room);

      return roomId;
    }

    return null;
  };

  return (
    <SnackbarProvider>
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" justifyContent="center" className={classes.title}>
          <Typography variant="h2">ChaoChat</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          {user ? (
            <Button variant="outlined" onClick={handleOpen}>
              ルームを作る
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              onClick={handleSignin}
            >
              ツイッターでログイン
            </Button>
          )}
        </Box>
        <CreateRoomDialog
          open={open}
          handleClose={handleClose}
          handleCreateRoom={handleCreateRoom}
        />
      </Box>
    </SnackbarProvider>
  );
};

export default Index;
