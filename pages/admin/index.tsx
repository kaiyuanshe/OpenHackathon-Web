import { observer } from 'mobx-react';
import { compose, JWTProps, jwtVerifier } from 'next-ssr-middleware';
import { FC } from 'react';

import ActivityList from '../../components/Activity/ActivityList';
import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { i18n } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';

const { t } = i18n;

export const getServerSideProps = compose<{}, JWTProps>(jwtVerifier());

const AdminPage: FC<JWTProps> = observer(props => (
  <PlatformAdminFrame {...props} title={t('activity_manage')} path="/">
    <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
  </PlatformAdminFrame>
));

export default AdminPage;
