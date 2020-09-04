import { NextPage } from 'next';
import AppBar from 'components/common/header/AppBar';
import { useUser } from 'contexts/UserContext';

const Room: NextPage = () => {
  const { user, loadingUser } = useUser();

  return (
    <>
      <AppBar loadingUser={loadingUser} user={user} />
      <>Room</>
    </>
  );
};

export default Room;
