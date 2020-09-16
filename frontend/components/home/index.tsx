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
import Create from '@material-ui/icons/Create';
import Twitter from '@material-ui/icons/Twitter';
import Chat from '@material-ui/icons/Chat';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
  },
  bottomBox: {
    backgroundColor: theme.palette.primary.light,
  },
}));

const Home: FC = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width: 750px)');
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
    expiresIn: 3 | 5 | 10 | 15,
  ): Promise<string | null> => {
    if (user) {
      const room: ORoom = {
        name,
        members: [user.id],
        expiresIn,
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
      const sentRoom = await writeRoom(user.id, member, room);

      return sentRoom.id;
    }

    return null;
  };

  return (
    <Box display="flex" height="100%" flexDirection="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="33%"
      >
        <Box display="flex" flexDirection="column">
          <Typography
            variant="h2"
            align="center"
            color="primary"
            className={classes.title}
          >
            chaochat
          </Typography>
          <Box display="flex" justifyContent="center" mt="16px">
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                fullWidth
              >
                ルームを作る
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.bottomBox}
        padding={4}
        height="33%"
      >
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Box display="flex" flexDirection="row" mb={2}>
            <Create fontSize="large" />
            <Box
              fontWeight="bold"
              fontSize={matches ? '1.2em' : '1.4em'}
              ml="8px"
            >
              ルームを作ろう。
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" mb={2}>
            <Twitter fontSize="large" />
            <Box
              fontWeight="bold"
              fontSize={matches ? '1.2em' : '1.4em'}
              ml="8px"
            >
              Twitterでシェアしよう。
            </Box>
          </Box>
          <Box display="flex" flexDirection="row">
            <Chat fontSize="large" />
            <Box
              fontWeight="bold"
              fontSize={matches ? '1.2em' : '1.4em'}
              ml="8px"
            >
              制限時間までチャットしよう。
            </Box>
          </Box>
        </Box>
      </Box>
      <Box />

      <CreateRoomDialog
        open={open}
        handleClose={handleClose}
        handleCreateRoom={handleCreateRoom}
      />
    </Box>
  );
};

export default Home;
