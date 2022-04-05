import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import PageHead from '../../components/PageHead';
import { ActivityDetail } from '../../components/ActivityDetail';
import { request } from '../api/core';
import { Activity } from '../api/Activity';

const HackathonActivity = ({
    activity
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <PageHead title={activity.name} />
            <ActivityDetail activity={activity} />
        </>
    );
};

export async function getServerSideProps({
    params
}: GetServerSidePropsContext<{ hackathonName: string }>) {
    const activity = await request<Activity>(
        `hackathon/${params!.hackathonName}`
    );
    return { props: { activity } };
}

export default HackathonActivity;
