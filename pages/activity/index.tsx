import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/ActivityList';

export default function ListPage() {
  return (
    <Container>
      <PageHead title="热门活动" />

      <h2 className="text-center my-5">热门活动</h2>

      <ActivityList size="lg" />
    </Container>
  );
}
