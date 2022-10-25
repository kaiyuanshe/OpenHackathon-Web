import { Container } from 'react-bootstrap';

import { ActivityEditor } from '../../components/ActivityEditor';
import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';

const createActivity = () => (
  <SessionBox auto>
    <PageHead title="创建活动" />

    <Container>
      <h2 className="text-center">创建活动</h2>

      <ActivityEditor />
    </Container>
  </SessionBox>
);

export default createActivity;
