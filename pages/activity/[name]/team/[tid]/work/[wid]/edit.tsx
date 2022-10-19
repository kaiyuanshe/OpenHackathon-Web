import type { InferGetServerSidePropsType } from 'next';

import PageHead from '../../../../../../../components/PageHead';
import { WorkEdit } from '../../../../../../../components/work/WorkEdit';
import { withRoute } from '../../../../../../api/core';

export const getServerSideProps =
  withRoute<Record<'name' | 'tid' | 'wid', string>>();

export default function WorkCreatePage({
  route: { params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <PageHead title="编辑作品" />

      <WorkEdit {...params!} />
    </>
  );
}
