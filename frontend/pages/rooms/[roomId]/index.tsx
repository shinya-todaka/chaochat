import { NextPage, GetServerSidePropsContext } from 'next';
import { useState, useEffect } from 'react';
import { Room } from 'models/room';
import SigninDialogProvider, {
  useAuthDialog,
} from 'contexts/SigninDialogContext';
import 'firebase/auth';
import { useUser } from 'contexts/UserContext';
import readRoom from 'services/read-room';
import RoomContainer from 'components/container/RoomContainer';

const RoomPage: NextPage = ({ room }) => {
  return (
    <SigninDialogProvider title="ルームに参加するためにログインしてください">
      <RoomContainer />
    </SigninDialogProvider>
  );
};

export default RoomPage;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ roomId: string }>,
) {
  const { params } = context;
  const { roomId } = params;
  const roomData = await readRoom(roomId);
  const room: Room = { ...roomData, createdAt: null };

  return {
    props: { room },
  };
}
