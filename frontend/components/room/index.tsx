import React, { FC, useEffect } from 'react';
import firebase from 'firebase/app';
import { useUser } from 'contexts/UserContext';
import useRoom from 'hooks/use-room';
import Box from '@material-ui/core/Box';
import { useAuthDialog } from 'contexts/SigninDialogContext';
import RoomHeader from 'components/room/RoomHeader';
import RoomFooter from 'components/room/RoomFooter';
import MessageList from 'components/common/list/MessageList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { OMember } from 'models/member';
import writeMember from 'services/write-member';
import removeMember from 'services/remove-member';
import writeMessage from 'services/write-message';
import { OMessage } from 'models/message';
import { useTextFieldDialog } from 'contexts/TextFieldDialogContext';
import { useSnackbar } from 'contexts/SnackBarContext';

const RoomContainer: FC<{ roomId: string }> = ({ roomId }) => {
  const { loadingUser, user } = useUser();
  const { onAuthStateChanged } = useAuthDialog();
  const { isInRoom, room, members, messages } = useRoom(
    user?.id || null,
    roomId,
  );
  const { showDialog } = useTextFieldDialog();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    onAuthStateChanged(!!user, loadingUser);
  }, [user, loadingUser, onAuthStateChanged]);

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  if (!room) {
    return (
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const handleJoin = async (anonymously: boolean) => {
    if (user) {
      if (!anonymously) {
        const member: OMember = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          isEnabled: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await writeMember(user.id, room.id, member);
      } else {
        const validator = (text: string) =>
          text.length > 0 && text.length <= 30;
        showDialog({
          title: '名前を決めてください',
          validator,
          actionTitle: '決定',
          action: async (name) => {
            const member: OMember = {
              displayName: name,
              photoURL: null,
              isEnabled: true,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            await writeMember(user.id, room.id, member);
          },
        });
      }
    }
  };

  const handleLeave = async () => {
    if (user && isInRoom) {
      await removeMember(user.id, room.id);
    }
  };

  const sendMessage = async (text: string) => {
    if (user && isInRoom) {
      const message: OMessage = {
        from: user.id,
        text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await writeMessage(room.id, message);
    }
  };

  const handleCopyUrl = async () => {
    const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${room.id}`;
    await navigator.clipboard.writeText(roomUrl);
    showSnackbar('urlをコピーしました!');
  };

  const handleTweet = () => {
    const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${room.id}`;
    const encodedUri = encodeURI(roomUrl);
    const uri = `https://twitter.com/intent/tweet?url=${encodedUri}`;
    window.open(uri);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <RoomHeader
        title={room.name}
        room={room}
        members={members}
        onClickLeave={handleLeave}
        handleTweet={handleTweet}
        handleCopyUrl={handleCopyUrl}
      />

      <Box flex={1} overflow="auto" id="scroll-area" padding={1}>
        {user && (
          <MessageList roomId={room.id} uid={user.id} messages={messages} />
        )}
      </Box>

      <RoomFooter
        isInRoom={isInRoom}
        room={room}
        sendMessage={sendMessage}
        handleJoin={handleJoin}
      />
    </Box>
  );
};

export default RoomContainer;
