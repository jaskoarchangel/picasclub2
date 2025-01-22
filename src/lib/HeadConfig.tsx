'use client'; // Marca para rodar no cliente

import { ReactNode } from 'react';
import Head from 'next/head';

export const HeadConfig = ({
  title = 'PicasClub',
  description = 'Cifras aqui.',
  favicon = 'https://akamai.sscdn.co/cc/img/favicon.ico', // Valor padrão para favicon externo
}: {
  title?: string;
  description?: string;
  favicon?: string;
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={favicon} />
    </Head>
  );
};
