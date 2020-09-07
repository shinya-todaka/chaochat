import { NextPage, GetServerSidePropsContext } from 'next';
import { IRoom } from 'models/room';
import SigninDialogProvider from 'contexts/SigninDialogContext';
import 'firebase/auth';
import readRoom from 'services/read-room';
import RoomContainer from 'components/container/RoomContainer';

const RoomPage: NextPage<{ room: IRoom }> = ({ room }) => {
  return (
    <SigninDialogProvider title="ルームに参加するためにログインしてください">
      <RoomContainer room={room} />
    </SigninDialogProvider>
  );
};

export default RoomPage;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ roomId: string }>,
) {
  const { params } = context;
  if (!params) return { props: {} };
  const { roomId } = params;
  const room = await readRoom(roomId);
  if ('createdAt' in room) room.createdAt = null;

  return {
    props: { room },
  };
}
