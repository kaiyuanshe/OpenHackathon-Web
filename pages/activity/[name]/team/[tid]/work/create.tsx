import type { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';

import PageHead from '../../../../../../components/layout/PageHead';
import { WorkEdit } from '../../../../../../components/Team/WorkEdit';
import { i18n } from '../../../../../../models/Base/Translation';

export const getServerSideProps = compose<
  Record<'name' | 'tid', string>,
  RouteProps<Record<'name' | 'tid', string>>
>(router, translator(i18n));

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
