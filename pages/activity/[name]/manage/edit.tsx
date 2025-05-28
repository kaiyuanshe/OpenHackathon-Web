import { observer } from 'mobx-react';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';

import { ActivityEditor } from '../../../../components/Activity/ActivityEditor';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type ActivityEditPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const ActivityEditPage: FC<ActivityEditPageProps> = observer(
  ({ route: { resolvedUrl, params } }) => {
    const { t } = useContext(I18nContext);

    return (
      <ActivityManageFrame name={params!.name} path={resolvedUrl} title={t('edit_activity')}>
        <ActivityEditor name={params!.name} />
      </ActivityManageFrame>
    );
  },
);
export default ActivityEditPage;
