import type { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';

import PageHead from '../../../../../../../components/layout/PageHead';
import { WorkEdit } from '../../../../../../../components/Team/WorkEdit';
import { i18n } from '../../../../../../../models/Base/Translation';

const { t } = i18n;

export const getServerSideProps = compose<
  Record<'name' | 'tid' | 'wid', string>,
  RouteProps<Record<'name' | 'tid' | 'wid', string>>
>(router, translator(i18n));

export default function WorkCreatePage({
  route: { params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <PageHead title={t('edit_work')} />

      <WorkEdit {...params!} />
    </>
  );
}
