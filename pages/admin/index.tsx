import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/ActivityList';

export default function AdminPage() {
  return (
    <>
      <PageHead title="平台管理" />

      <Container fluid>
        <ActivityList type="admin" size="lg" />
      </Container>
    </>
  );
}
