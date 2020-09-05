import React, { FC, useEffect } from 'react';
import { useUser } from 'contexts/UserContext';
import AppBar from 'components/common/header/AppBar';
import Box from '@material-ui/core/Box';
import { useAuthDialog } from 'contexts/SigninDialogContext';

const RoomContainer: FC = () => {
  const { loadingUser, user } = useUser();
  const { onAuthStateChanged } = useAuthDialog();

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
        height="calc(100vh - 50px)"
        overflow="hidden"
      />
    </>
  );
};

export default RoomContainer;
