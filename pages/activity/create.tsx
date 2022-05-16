import PageHead from '../../components/PageHead';
import ActivityCreate from '../../components/ActivityCreate';
import { withSession } from '../api/user/session';

export const getServerSideProps = withSession();

const createActivity = () => (
  <>
    <PageHead title="创建活动" />

    <ActivityCreate />
  </>
);

export default createActivity;
