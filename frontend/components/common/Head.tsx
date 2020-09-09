import * as React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  description: string;
  keyword: string;
  image: string;
  imageWidth: string;
  imageHeight: string;
  url: string;
}

// eslint-disable-next-line no-underscore-dangle
const _Head = ({
  title,
  description,
  keyword,
  image,
  imageWidth,
  imageHeight,
  url,
}: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta property="og:type" content="app" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:width" content={imageWidth} />
      <meta property="og:height" content={imageHeight} />
      <meta property="og:site_name" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@8Ns3H8FjEGXX4MI" />
      <meta name="twitter:url" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
    </Head>
  );
};

export default _Head;
