import { observer } from 'mobx-react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';
import ActivityList from '../../components/Activity/ActivityList';
import sessionStore from '../../models/Session';

const AdminPage = observer(() => (
  <SessionBox auto>
    <Container fluid>
      <PageHead title="平台管理" />

      <ActivityList type="admin" size="lg" userId={sessionStore.user?.id} />
    </Container>
  </SessionBox>
));

export default AdminPage;
