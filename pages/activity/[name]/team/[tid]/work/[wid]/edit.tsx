import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import PageHead from '../../../../../../../components/PageHead';
import WorkEdit from '../../../../../../../components/work/WorkEdit';
import { TeamWork } from '../../../../../../../models/Team';
import activityStore from '../../../../../../../models/Activity';
//TODO new getServerSideProps
// export const getServerSideProps = withRoute<
//   { name: string; tid: string; wid: string },
//   { activity: TeamWork }
// >(async ({ params: { name = '', tid = '', wid = '' } = {} }) => {
//   try {
//     const work = await activityStore.teamOf(name).workOf(tid).getOne(wid);

//     return { props: { work } };
//   } catch (error) {
//     console.error(error);

//     return { notFound: true, props: { work: {} as TeamWork } };
//   }
// });

export async function getServerSideProps({
  req,
  params: { name = '', tid, wid = '' } = {},
}: GetServerSidePropsContext<Partial<Record<'name' | 'tid' | 'wid', string>>>) {
  try {
    const work = await activityStore.teamOf(name).workOf(tid).getOne(wid);

    return {
      props: { work, path: req.url },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: { work: {} as TeamWork },
    };
  }
}
const creatework = ({
  work,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <PageHead title="编辑作品" />
    <WorkEdit work={work} />
  </>
);

export default creatework;
