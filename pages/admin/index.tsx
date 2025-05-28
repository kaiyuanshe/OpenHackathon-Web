import { observer } from 'mobx-react';
import { FC, useContext } from 'react';

import ActivityList from '../../components/Activity/ActivityList';
import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { I18nContext } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import { sessionGuard } from '../api/core';

export const getServerSideProps = sessionGuard;

const AdminPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <PlatformAdminFrame title={t('activity_manage')} path="/">
      <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
    </PlatformAdminFrame>
  );
});
export default AdminPage;
