import { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router } from 'next-ssr-middleware';

import { ActivityEditor } from '../../../../components/Activity/ActivityEditor';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { i18n } from '../../../../models/Base/Translation';

const { t } = i18n;

export const getServerSideProps = compose<
  { name: string },
  RouteProps<{ name: string }>
>(router);

const ActivityEditPage = ({
  route: { resolvedUrl, params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame
    name={params!.name}
    path={resolvedUrl}
    title={t('edit_activity')}
  >
    <ActivityEditor name={params!.name} />
  </ActivityManageFrame>
);

export default ActivityEditPage;
