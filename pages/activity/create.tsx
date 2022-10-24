import ActivityCreate from '../../components/ActivityCreate';
import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';

const createActivity = () => (
  <SessionBox auto>
    <PageHead title="创建活动" />

    <ActivityCreate />
  </SessionBox>
);

export default createActivity;
