import type { InferGetServerSidePropsType } from 'next';

import PageHead from '../../../../../../components/PageHead';
import { WorkEdit } from '../../../../../../components/work/WorkEdit';
import { i18n } from '../../../../../../models/Translation';
import { withRoute } from '../../../../../api/core';

export const getServerSideProps = withRoute<Record<'name' | 'tid', string>>();

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
