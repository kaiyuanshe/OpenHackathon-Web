import { observer } from 'mobx-react';
import { FC } from 'react';

import ActivityList from '../../components/Activity/ActivityList';
import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { i18n } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import { sessionGuard } from '../api/core';

const { t } = i18n;

export const getServerSideProps = sessionGuard;

const AdminPage: FC = observer(() => (
  <PlatformAdminFrame title={t('activity_manage')} path="/">
    <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
  </PlatformAdminFrame>
));

export default AdminPage;
