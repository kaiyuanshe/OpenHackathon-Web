import PageHead from '../../../../../../components/PageHead';
import WorkCreate from '../../../../../../components/work/WorkCreate';
import { withSession } from '../../../../../api/user/session';

export const getServerSideProps = withSession();

const createActivity = () => (
  <>
    <PageHead title="创建作品" />

    <WorkCreate />
  </>
);

export default createActivity;
