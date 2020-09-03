import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Room: NextPage = () => {
  const router = useRouter();
  const { roomId } = router.query;

  return (
    <>
      <p>{`roomId is ${roomId} !`}</p>
    </>
  );
};

export default Room;
