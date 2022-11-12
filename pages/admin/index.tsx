import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Container } from 'react-bootstrap';

import ActivityList from '../../components/Activity/ActivityList';
import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';
import sessionStore from '../../models/Session';

const AdminPage = observer(() => (
  <SessionBox auto>
    <Container fluid>
      <PageHead title={t('platform_management')} />

      <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
    </Container>
  </SessionBox>
));

export default AdminPage;
