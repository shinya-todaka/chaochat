import React from 'react';
import { NextPage } from 'next';
import Home from 'components/home';
import 'firebase/auth';

import SnackbarProvider from 'contexts/SnackBarContext';

const Index: NextPage = () => {
  return (
    <SnackbarProvider>
      <Home />
    </SnackbarProvider>
  );
};

export default Index;
