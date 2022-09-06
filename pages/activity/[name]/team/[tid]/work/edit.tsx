import PageHead from '../../../../../../components/PageHead';
import WorkEdit from '../../../../../../components/work/WorkEdit';
import { TeamWork } from '../../../../../../models/Team';
import { withSession } from '../../../../../api/user/session';

// export const getServerSideProps = withSession(
//   async ({
//     req,
//     res,
//     params: { name } = {},
//   }: GetServerSidePropsContext<{ name?: string }>) => {
//     if (!name)
//       return {
//         notFound: true,
//         props: {} as EditPageProps,
//       };

//     const work = await request<TeamWork>(
//       `hackathon/${name}/team/${tid}/works`,
//       'GET',
//       undefined,
//       { req, res },
//     );
//     return { props: { work, path: req.url, workName: name } };
//   },
// );
const creatework = () => (
  <>
    <PageHead title="编辑作品" />

    {/* <WorkEdit /> */}
  </>
);

export default creatework;
