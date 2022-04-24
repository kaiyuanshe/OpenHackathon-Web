import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/ActivityList';

export default function AdminPage() {
  return (
    <Container fluid>
      <PageHead title="平台管理" />

      <ActivityList type="admin" size="lg" />
    </Container>
  );
}
