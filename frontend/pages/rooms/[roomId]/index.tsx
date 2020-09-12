import { NextPage, GetServerSidePropsContext } from 'next';
import { IRoom } from 'models/room';
import SigninDialogProvider from 'contexts/SigninDialogContext';
import MembersContextProvider from 'contexts/MembersContext';
import 'firebase/auth';
import readRoom from 'services/read-room';
import Room from 'components/room';
import Head from 'components/common/Head';
import Box from '@material-ui/core/Box';

const RoomPage: NextPage<{ room: IRoom | null }> = ({ room }) => {
  if (!room) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        ルームがありません!
      </Box>
    );
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_HOST}/ogpImage?title=${room.name}`;
  const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${room.id}`;

  return (
    <>
      <Head
        title="chaochat"
        description="とくめいで参加できるグループチャット"
        keyword="chaochat"
        image={imageUrl}
        imageWidth="1200"
        imageHeight="630"
        url={roomUrl}
      />
      <SigninDialogProvider title="ルームに参加するためにログインしてください">
        <MembersContextProvider>
          <Room roomId={room.id} />
        </MembersContextProvider>
      </SigninDialogProvider>
    </>
  );
};

export default RoomPage;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ roomId: string }>,
) {
  const { params } = context;
  if (!params) return { props: {} };
  const { roomId } = params;
  try {
    const room = await readRoom(roomId);
    if ('createdAt' in room) room.createdAt = null;
    if ('updatedAt' in room) room.updatedAt = null;

    return {
      props: { room },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
