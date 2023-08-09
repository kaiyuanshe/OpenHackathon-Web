import type { InferGetServerSidePropsType } from 'next';
import { cache, compose, router, translator } from 'next-ssr-middleware';

import PageHead from '../../../../../../components/layout/PageHead';
import { WorkEdit } from '../../../../../../components/Team/WorkEdit';
import { i18n } from '../../../../../../models/Translation';

export const getServerSideProps = compose(
  cache(),
  translator(i18n),
  router<Record<'name' | 'tid', string>>,
);

const { t } = i18n;

export default function WorkCreatePage({
  route: { params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <PageHead title={t('submit_work')} />

      <WorkEdit {...params!} />
    </>
  );
}
