import { observer } from 'mobx-react';

import ActivityList from '../../components/Activity/ActivityList';
import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import sessionStore from '../../models/Session';
import { i18n } from '../models/Translation';

const AdminPage = observer(() => (
  <PlatformAdminFrame title={t('activity_manage')} path="/">
    <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
  </PlatformAdminFrame>
));

export default AdminPage;
