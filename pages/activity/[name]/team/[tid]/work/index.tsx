import { useState, useEffect } from 'react';
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import { useRouter } from 'next/router';
import {
  Container,
  Col,
  Button,
  Image,
  Accordion,
  Ratio,
} from 'react-bootstrap';

import { request } from '../../../../../api/core';
import { ListData } from '../../../../../../models/Base';
import { WorkTypeEnum, Team, TeamWork } from '../../../../../../models/Team';

export async function getServerSideProps({
  params: { name, tid } = {},
}: GetServerSidePropsContext<{ name?: string; tid?: string }>) {
  if (!name || !tid)
    return {
      notFound: true,
      props: {} as { team: Team; teamWorkList: ListData<TeamWork> },
    };
  const team = await request<Team>(`hackathon/${name}/team/${tid}`);

  const teamWorkList = await request<ListData<TeamWork>>(
    `hackathon/${name}/team/${tid}/works`,
  );
  return { props: { team, teamWorkList } };
}

export default function TeamsPage({
  team: {
    hackathonName,
    displayName,
    description,
    creator: { photo },
  },
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
    const { nextLink, value } = await request<ListData<TeamWork>>(url);
    setMoreTeamWorksURL(() => nextLink || '');
    setTeamWorks(teamWorks => [...teamWorks, ...value]);
  }
  useEffect(() => {}, []);

  return (
    <Container as="main">
      <Col xs={12} sm={8}>
        <Accordion>
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
      </Col>
    </Container>
  );
}
