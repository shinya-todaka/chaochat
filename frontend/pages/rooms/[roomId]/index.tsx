import { NextPage } from 'next';
import SigninDialogProvider from 'contexts/SigninDialogContext';
import MembersContextProvider from 'contexts/MembersContext';
import 'firebase/auth';
import Room from 'components/room';
import Head from 'components/common/Head';
import AppBar from 'components/common/header/AppBar';
import Box from '@material-ui/core/Box';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';

const RoomPage: NextPage = () => {
  const router = useRouter();
  const { roomId } = router.query;

  if (!roomId || typeof roomId !== 'string') {
    return <Typography>Something is wrong!</Typography>;
  }

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const imageUrl = `https://storage.googleapis.com/${projectId}.appspot.com/message/v1/ogpImage/roomId/${roomId}.png`;
  const roomUrl = `${process.env.NEXT_PUBLIC_HOST}/rooms/${roomId}`;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Head
        title="chaochat | とくめいで参加できる時間制限ありのグループチャット"
        description="とくめいで参加できる時間制限ありのグループチャット"
        keyword="chaochat"
        image={imageUrl}
        imageWidth="1200"
        imageHeight="630"
        url={roomUrl}
      />
      <SigninDialogProvider title="ルームに参加するためにログインしてください">
        <MembersContextProvider>
          <AppBar />
          <Box display="flex" flexDirection="column" height="calc(100% - 50px)">
            <Room roomId={roomId} />
          </Box>
        </MembersContextProvider>
      </SigninDialogProvider>
    </Box>
  );
};

export default RoomPage;
