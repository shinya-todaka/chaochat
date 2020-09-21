import React, { FC, useState, useEffect } from 'react';
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
import writeMessage from 'services/write-message';
import { OMessage } from 'models/message';
import { useSnackbar } from 'contexts/SnackBarContext';
import MembersDialog from 'components/room/MembersDialog';

const RoomContainer: FC<{ roomId: string }> = ({ roomId }) => {
  const { loadingUser, user } = useUser();
  const { onAuthStateChanged } = useAuthDialog();
  const { isInRoom, room, members, messages } = useRoom(
    user?.id || null,
    roomId,
  );
  const { showSnackbar } = useSnackbar();
  const [isOpenMembersDialog, setIsOpenMembersDialog] = useState(false);

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
        };
        await writeMember(user.id, room.id, member);
      } else {
        throw Error('this operation is not permitted');
      }
    }
  };

  const sendMessage = async (text: string) => {
    if (user && isInRoom) {
      const message: OMessage = {
        from: user.id,
        text,
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

  const handleClickAvatars = () => {
    setIsOpenMembersDialog(true);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      aria-controls="room-members"
    >
      <RoomHeader
        title={room.name}
        room={room}
        members={members}
        handleTweet={handleTweet}
        handleCopyUrl={handleCopyUrl}
        handleClickAvatars={handleClickAvatars}
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
      <MembersDialog
        members={members}
        open={isOpenMembersDialog}
        setIsOpen={setIsOpenMembersDialog}
      />
    </Box>
  );
};

export default RoomContainer;
