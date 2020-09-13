import React, { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useUser } from 'contexts/UserContext';
import firebase from 'firebase/app';
import { ORoom } from 'models/room';
import { OMember } from 'models/member';
import { TwitterIcon } from 'components/common/icons';
import CreateRoomDialog from 'components/common/CreateRoomDialog';
import writeRoom from 'services/write-room';
import CircularProgress from '@material-ui/core/CircularProgress';

const Home: FC = () => {
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
      const room: ORoom = {
        name,
        members: [user.id],
        expiresIn: 5,
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
    <Box display="flex" height="100%" flexDirection="column">
      <Box alignItems="center" m="30px">
        <Typography variant="h2" align="center">
          ChaoChat
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        {loadingUser && <CircularProgress />}
        {!user && !loadingUser && (
          <Button
            variant="outlined"
            startIcon={<TwitterIcon />}
            onClick={handleSignin}
          >
            ツイッターでログイン
          </Button>
        )}
        {user && (
          <Button variant="outlined" onClick={handleOpen}>
            ルームを作る
          </Button>
        )}
      </Box>
      <CreateRoomDialog
        open={open}
        handleClose={handleClose}
        handleCreateRoom={handleCreateRoom}
      />
    </Box>
  );
};

export default Home;
