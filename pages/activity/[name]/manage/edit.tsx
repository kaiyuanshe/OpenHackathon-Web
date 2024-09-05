import { observer } from 'mobx-react';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC } from 'react';

import { ActivityEditor } from '../../../../components/Activity/ActivityEditor';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { i18n } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

const { t } = i18n;

type ActivityEditPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(
  router,
  sessionGuard,
);

const ActivityEditPage: FC<ActivityEditPageProps> = observer(
  ({ route: { resolvedUrl, params } }) => (
    <ActivityManageFrame
      name={params!.name}
      path={resolvedUrl}
      title={t('edit_activity')}
    >
      <ActivityEditor name={params!.name} />
    </ActivityManageFrame>
  ),
);
export default ActivityEditPage;
