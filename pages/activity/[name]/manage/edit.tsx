import { InferGetServerSidePropsType } from 'next';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { ActivityEditor } from '../../../../components/ActivityEditor';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

const ActivityEditPage = ({
  route: { resolvedUrl, params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame name={params!.name} path={resolvedUrl} title="编辑活动">
    <ActivityEditor name={params!.name} />
  </ActivityManageFrame>
);

export default ActivityEditPage;
