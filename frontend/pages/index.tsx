import React from 'react';
import { NextPage } from 'next';
import Home from 'components/home';
import AppBar from 'components/common/header/AppBar';
import 'firebase/auth';
import Box from '@material-ui/core/Box';

const Index: NextPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <AppBar />
      <Home />
    </Box>
  );
};

export default Index;
