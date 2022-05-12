import PageHead from '../../components/PageHead';
import ActivityCreate from '../../components/ActivityCreate';
import { GetServerSidePropsContext } from 'next';
import { readCookie } from '../api/core';

const createActivity = () => {
  return (
    <>
      <PageHead title="创建活动" />
      <ActivityCreate />
    </>
  );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  //todo will expired token show
  if (!readCookie(req, 'token')) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  return { props: {} };
}

export default createActivity;
