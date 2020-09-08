import { NextPage, GetServerSidePropsContext } from 'next';
import { IRoom } from 'models/room';
import SigninDialogProvider from 'contexts/SigninDialogContext';
import 'firebase/auth';
import readRoom from 'services/read-room';
import RoomContainer from 'components/container/RoomContainer';
import Head from 'components/common/Head';
import TextFieldDialogProvider from 'contexts/TextFieldDialogContext';

const RoomPage: NextPage<{ room: IRoom | null }> = ({ room }) => {
  if (!room) {
    return <>Something wrong!</>;
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_HOST}/ogpImage?title=${room.name}`;
  const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${room.id}`;

  return (
    <>
      <Head
        title="chaochat"
        description="匿名で参加できるチャット"
        keyword="chaochat"
        image={imageUrl}
        url={roomUrl}
      />
      <SigninDialogProvider title="ルームに参加するためにログインしてください">
        <TextFieldDialogProvider>
          <RoomContainer room={room} />
        </TextFieldDialogProvider>
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

    return {
      props: { room },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
