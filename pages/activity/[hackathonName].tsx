import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { request } from '../api/core';
import { Activity } from '../api/Activity';
import PageHead from '../../components/PageHead';
import ActivityDetail from '../../components/ActivityDetail';

const HackathonActivity = ({ activity }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <>
    <PageHead title={activity.name} />
    <ActivityDetail activity={activity} />
  </>;
};

export async function getServerSideProps(context: GetServerSidePropsContext<{ hackathonName: string }>) {
  const hackathonName: string = context.params!.hackathonName;
  const activity: Activity = await request<Activity>('hackathon/' + hackathonName);
  return { props: { activity } };
}

export default HackathonActivity;