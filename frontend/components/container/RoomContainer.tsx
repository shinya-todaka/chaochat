import React, { FC, useEffect } from 'react';
import { useUser } from 'contexts/UserContext';
import useRoom from 'hooks/use-room';
import AppBar from 'components/common/header/AppBar';
import Box from '@material-ui/core/Box';
import { useAuthDialog } from 'contexts/SigninDialogContext';
import RoomHeader from 'components/rooms/RoomHeader';
import MessageList from 'components/common/list/MessageList';
import RoomFooter from 'components/rooms/RoomFooter';
import { IRoom } from 'models/room';

const RoomContainer: FC<{ room: IRoom }> = ({ room }) => {
  const { loadingUser, user } = useUser();
  const { onAuthStateChanged } = useAuthDialog();
  const { isInRoom, members, messages } = useRoom(user?.id || null, room.id);

  useEffect(() => {
    onAuthStateChanged(!!user, loadingUser);
  }, [user, loadingUser, onAuthStateChanged]);

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
        <RoomHeader
          title={room.name || ''}
          members={[]}
          onClickLeave={() => undefined}
        />
        <MessageList roomId="" uid="" messages={[]} />
        <Box position="fixed" bottom="0" width="100%" flexGrow={1}>
          <RoomFooter
            isInRoom={false}
            room={room}
            sendMessage={() => undefined}
            handleJoin={() => undefined}
          />
        </Box>
      </Box>
    </>
  );
};

export default RoomContainer;
