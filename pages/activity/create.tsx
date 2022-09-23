import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/Session/SessionBox';
import ActivityCreate from '../../components/ActivityCreate';

const createActivity = () => (
  <SessionBox auto>
    <PageHead title="创建活动" />

    <ActivityCreate />
  </SessionBox>
);

export default createActivity;
