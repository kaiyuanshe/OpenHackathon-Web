import { useState, useEffect } from 'react';
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TeamsPage from '../index';
import {
  Container,
  Col,
  Button,
  Image,
  Accordion,
  Ratio,
} from 'react-bootstrap';

import { request, requestClient } from '../../../../../api/core';
import { ListData } from '../../../../../../models/Base';
import { WorkTypeEnum, Team, TeamWork } from '../../../../../../models/Team';

export async function getServerSideProps({
  params: { name, tid } = {},
}: GetServerSidePropsContext<{ name?: string; tid?: string }>) {
  if (!name || !tid)
    return {
      notFound: true,
      props: {} as { teamWorkList: ListData<TeamWork> },
    };

  const teamWorkList = await request<ListData<TeamWork>>(
    `hackathon/${name}/team/${tid}/works`,
  );
  return { props: { teamWorkList } };
}

export default function TeamWorksPage({
  teamWorkList: { nextLink, value: workList },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    query: { name, tid },
    push,
  } = useRouter();

  if (!name || Array.isArray(name) || !tid || Array.isArray(tid)) push('/404');

  const [moreTeamWorksURL, setMoreTeamWorksURL] = useState<string>(nextLink);
  const [teamWorks, setTeamWorks] = useState<TeamWork[]>([...workList]);

  async function getMoreTeamWorks(url: string) {
    const { nextLink, value } = await requestClient<ListData<TeamWork>>(url);
    setMoreTeamWorksURL(() => nextLink || '');
    setTeamWorks(teamWorks => [
      ...teamWorks,
      {
        createdAt: 'The UTC timestamp when this object was created.',
        updatedAt: 'The last UTC timestamp when the this object was updated.',
        teamId: 'Id of the team',
        id: 'auto-generated id of the work.',
        hackathonName: 'name of hackathon',
        title: 'title of the work. Requried for creation.',
        description: 'description of the work',
        type: {
          image: '',
          website: '',
          video: '',
          word: '',
          powerpoint: '',
        },
        url: "Uri of the work. Requried for creation.\r\nIf the url is from a third-party website, please make sure it's allowed to be referenced by https://hackathon.kaiyuanshe.cn.",
      },
      ...value,
    ]);
  }
  useEffect(() => {
    getMoreTeamWorks(`hackathon/${name}/team/${tid}/works`);
  }, []);

  return (
    <TeamsPage>
      <Accordion>
        <Link href={`/activity/${name}/team/${tid}/work/create`}>
          <Button variant="success" className="me-3">
            创建黑客松活动
          </Button>
        </Link>
        {teamWorks?.map(
          ({ updatedAt, id, title, description, type, url }, index) => (
            <Accordion.Item eventKey={`${index}`} key={id}>
              <Accordion.Header>
                {title} - {updatedAt ? updatedAt.slice(0, 10) + ' 更新' : ''}
              </Accordion.Header>
              <Accordion.Body>
                <p>{description}</p>
                {type === WorkTypeEnum.IMAGE ? (
                  <Image src={url} className="mw-100" alt={title} />
                ) : type === WorkTypeEnum.VIDEO ? (
                  <Ratio aspectRatio="16x9">
                    <video controls width="250" src={url} />
                  </Ratio>
                ) : (
                  <a href={url} title={title}>
                    {title}
                  </a>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ),
        )}
      </Accordion>

      {moreTeamWorksURL && (
        <Button
          className="w-100"
          onClick={() => getMoreTeamWorks(moreTeamWorksURL)}
        >
          加载更多
        </Button>
      )}
    </TeamsPage>
  );
}
