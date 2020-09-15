import React from 'react';
import { NextPage } from 'next';
import Home from 'components/home';
import AppBar from 'components/common/header/AppBar';
import 'firebase/auth';
import Box from '@material-ui/core/Box';
import Head from 'next/head';

const Index: NextPage = () => {
  const title = 'chaochat | とくめいで参加できる時間制限ありのグループチャット';
  const description = 'とくめいで参加できる時間制限ありのグループチャット';
  const url = `${process.env.NEXT_PUBLIC_HOST}`;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="keywords" content="chaochat" />
        <meta property="og:type" content="app" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={title} />
      </Head>
      <AppBar />
      <Home />
    </Box>
  );
};

export default Index;
