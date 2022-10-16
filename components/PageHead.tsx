import type { FC } from 'react';
import Head from 'next/head';

export interface PageHeadProps {
  title?: string;
  description?: string;
}

const Name = process.env.NEXT_PUBLIC_SITE_NAME,
  Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY;

const PageHead: FC<PageHeadProps> = ({
  title,
  description = Summary,
  children,
}) => (
  <Head>
    <title>
      {title}
      {title && ' - '}
      {Name}
    </title>

    {description && <meta name="description" content={description} />}

    {children}
  </Head>
);

export default PageHead;
