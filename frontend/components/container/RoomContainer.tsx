import React, { FC, useEffect } from 'react';
import firebase from 'firebase/app';
import { useUser } from 'contexts/UserContext';
import useRoom from 'hooks/use-room';
import AppBar from 'components/common/header/AppBar';
import Box from '@material-ui/core/Box';
import { useAuthDialog } from 'contexts/SigninDialogContext';
import RoomHeader from 'components/rooms/RoomHeader';
import MessageList from 'components/common/list/MessageList';
import { IRoom } from 'models/room';
import { OMember } from 'models/member';
import writeMember from 'services/write-member';
import removeMember from 'services/remove-member';
import writeMessage from 'services/write-message';
import JoinRoomFooter from 'components/common/footer/JoinRoomFooter';
import Input from 'components/common/footer/Input';
import { OMessage } from 'models/message';

const RoomContainer: FC<{ room: IRoom }> = ({ room }) => {
  const { loadingUser, user } = useUser();
  const { onAuthStateChanged } = useAuthDialog();
  const { isInRoom, members, messages } = useRoom(user?.id || null, room.id);

  useEffect(() => {
    onAuthStateChanged(!!user, loadingUser);
  }, [user, loadingUser, onAuthStateChanged]);

  useEffect(() => {}, [messages, isInRoom, members]);

  const handleJoin = async () => {
    if (user) {
      const member: OMember = {
        displayName: user.displayName,
        photoUrl: user.photoUrl,
        isEnabled: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await writeMember(user.id, room.id, member);
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

  return (
    <>
      <AppBar loadingUser={loadingUser} user={user} />
      <Box
        display="flex"
        justifyContent="center"
        bgcolor="white"
        alignItems="center"
        flexDirection="column"
        height="calc(100vh - 50px)"
        overflow="hidden"
      >
        <Box display="flex" flexDirection="column" width="100%" height="100%">
          <RoomHeader
            title={room.name || ''}
            members={members}
            onClickLeave={handleLeave}
          />
          {user ? (
            <MessageList roomId={room.id} uid={user.id} messages={messages} />
          ) : (
            <></>
          )}
          <Box position="fixed" bottom="0" width="100%" flexGrow={1}>
            {isInRoom ? (
              <Input sendMessage={sendMessage} />
            ) : (
              <JoinRoomFooter room={room} onClickJoin={handleJoin} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RoomContainer;
