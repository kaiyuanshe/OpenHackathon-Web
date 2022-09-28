import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';
import ActivityCreate from '../../components/ActivityCreate';

const createActivity = () => (
  <SessionBox auto>
    <PageHead title="创建活动" />

    <ActivityCreate />
  </SessionBox>
);

export default createActivity;
