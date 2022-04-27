import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/ActivityList';
import { withSession } from '../api/user/session';

export const getServerSideProps = withSession();

export default function AdminPage() {
  return (
    <Container fluid>
      <PageHead title="平台管理" />

      <ActivityList type="admin" size="lg" />
    </Container>
  );
}
