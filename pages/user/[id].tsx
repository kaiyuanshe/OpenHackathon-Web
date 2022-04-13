import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import PageHead from '../../components/PageHead';
import { UserDetail } from '../../components/UserDetails';
import { UserDetailProps } from '../../components/UserDetails';
import { request } from '../api/core';

const UserDetailPage = ({
  userInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <main
      className="py-5"
      style={{
        background:
          'url(https://hackathon-api.static.kaiyuanshe.cn/static/profile-back-pattern.png)',
      }}
    >
      <PageHead title="用户资料" />
      <UserDetail {...userInfo} />
    </main>
  );
};

export async function getServerSideProps({
  params: { id } = {},
}: GetServerSidePropsContext<{ id?: string }>) {
  if (!id)
    return {
      notFound: true,
      props: {} as { userInfo: UserDetailProps },
    };

  const userInfo = await request<UserDetailProps>(`user/${id}`);
  return { props: { userInfo } };
}

export default UserDetailPage;
