import { NextPage } from 'next';
import AppBar from 'components/common/header/AppBar';
import { useState, useEffect } from 'react';
import { Message } from 'models/message';
import { Member } from 'models/member';
import MessageList from 'components/common/list/MessageList';
import Box from '@material-ui/core/Box';
import useRoom from 'hooks/use-room';
import RoomFooter from 'components/rooms/RoomFooter';
import writeMessage from 'services/write-message';
import RoomHeader from 'components/rooms/RoomHeader';
import SigninDialog from 'components/common/SigninDialog';
import useAuthDialog from 'hooks/use-authDialog';
import writeMember from 'services/write-member';
import removeMember from 'services/remove-member';
import SetAnonymousNameDialog from 'components/common/SetAnonymousMemberDialog';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/dist/client/router';
import { useUser } from 'contexts/UserContext';

const Room: NextPage = () => {
  const { user, loadingUser } = useUser();
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const { authDialogOpen, authDialogOnClose } = useAuthDialog(Boolean(user));
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!roomId) router.replace('/');

  const { isInitialFetching, room, isInRoom, members, messages } = useRoom(
    user?.id || null,
    roomId,
  );

  const handleSignin = async () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
  };

  const sendMessage = async (textToSend: string) => {
    if (user) {
      const message: Message = {
        from: user.id,
        text: textToSend,
        createdAt: null,
      };
      await writeMessage(roomId, message);
    }
  };

  const handleJoin = (anonymously: boolean) => {
    if (anonymously) {
      setIsAnonymous(true);
    } else if (user) {
      const member: Member = {
        displayName: user.displayName,
        photoUrl: user.photoUrl,
        isEnabled: true,
        createdAt: null,
      };
      writeMember(user.id, roomId, member);
    }
  };

  const joinAnonymously = (name: string) => {
    if (user) {
      const theMember: Member = {
        displayName: name,
        photoUrl: null,
        isEnabled: true,
        createdAt: null,
      };
      writeMember(user.id, roomId, theMember);
    }
  };

  const handleLeave = async () => {
    if (user) {
      await removeMember(user.id, roomId);
    }
  };

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <AppBar loadingUser={loadingUser} user={user} />
      <Box
        display="flex"
        justifyContent="center"
        bgcolor="white"
        alignItems="center"
        height="calc(100vh - 50px)"
        overflow="hidden"
      >
        <Box display="flex" flexDirection="column" width="100%" height="100%">
          <RoomHeader
            title="Room Name"
            members={members}
            onClickLeave={handleLeave}
          />
          <MessageList
            roomId={roomId}
            uid={user?.id || ''}
            messages={messages}
          />
          <Box position="fixed" bottom="0" width="100%" flexGrow="1">
            <RoomFooter
              isInitialFetching={isInitialFetching}
              isInRoom={isInRoom}
              room={room}
              sendMessage={sendMessage}
              handleJoin={handleJoin}
            />
          </Box>
          <SigninDialog
            open={authDialogOpen}
            onClose={authDialogOnClose}
            signin={handleSignin}
          />
          <SetAnonymousNameDialog
            open={isAnonymous}
            onClose={() => setIsAnonymous(false)}
            onClickCreate={joinAnonymously}
          />
        </Box>
      </Box>
    </>
  );
};

export default Room;
