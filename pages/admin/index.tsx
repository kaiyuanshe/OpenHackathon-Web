import { observer } from 'mobx-react';

import ActivityList from '../../components/Activity/ActivityList';
import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import sessionStore from '../../models/Session';

const AdminPage = observer(() => (
  <PlatformAdminFrame title="活动管理" path="/">
    <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
  </PlatformAdminFrame>
));

export default AdminPage;
