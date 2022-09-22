import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/SessionBox';
import { ActivityList } from '../../components/ActivityList';

export default function AdminPage() {
  return (
    <SessionBox auto>
      <Container fluid>
        <PageHead title="平台管理" />

        <ActivityList type="admin" size="lg" />
      </Container>
    </SessionBox>
  );
}
