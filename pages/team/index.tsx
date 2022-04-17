import { useState, useEffect } from 'react';
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import { useRouter } from 'next/router';
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Card,
  Accordion,
  Ratio,
} from 'react-bootstrap';
import { Icon } from 'idea-react';

import PageHead from '../../components/PageHead';
import { request } from '../api/core';
import { ListData } from '../../models/Base';
import { Activity } from '../../models/Activity';
import { WorkTypeEnum, Team, TeamWork, TeamMember } from '../../models/Team';

export async function getServerSideProps({
  req,
  params,
  res,
  query,
}: GetServerSidePropsContext<{ activity: string; tid: string }>) {
  if (!query?.activity || !query?.tid)
    return {
      notFound: true,
      props: {} as { team: Team; teamWorkList: ListData<TeamWork> },
    };
  const { activity, tid } = query;
  const team = await request<Team>(`hackathon/${activity}/team/${tid}`);
  const teamWorkList = await request<ListData<TeamWork>>(
    `hackathon/${activity}/team/${tid}/works`,
  );
  console.log('team:', team);

  return { props: { team, teamWorkList } };
}

const BackHost = process.env.NEXT_PUBLIC_API_HOST;

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
    query: { activity, tid },
  } = useRouter();

  const [moreTeamWorksURL, setMoreTeamWorksURL] = useState<string>(nextLink);
  const [teamWorks, setTeamWorks] = useState<TeamWork[]>([...workList]);
  const getMoreTeamWorks = async (url: string) => {
    const { nextLink, value } = await request<ListData<TeamWork>>(url);
    console.log('getMoreTeamWorks', nextLink, value);
    setMoreTeamWorksURL(() => nextLink || '');
    setTeamWorks(teamWorks => [...teamWorks, ...value]);
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [moreTeamMembersURL, setMoreTeamMembersURL] = useState<string>('');
  const getMoreTeamMembers = async (url: string) => {
    const { nextLink, value } = await request<ListData<TeamMember>>(url);
    console.log('getMoreTeamMembers', nextLink, value);
    setMoreTeamMembersURL(() => nextLink || '');
    setTeamMembers(teamMembers => [...teamMembers, ...value]);
  };

  const [hackathonDisplayName, setHackathonDisplayName] =
    useState<string>('活动');

  useEffect(() => {
    getMoreTeamMembers(`${BackHost}/hackathon/${activity}/team/${tid}/members`);
    (async () => {
      const { displayName } = await request<Activity>(
        `${BackHost}/hackathon/${activity}`,
      );
      setHackathonDisplayName(
        hackathonDisplayName => displayName || hackathonDisplayName,
      );
    })();
  }, []);

  return (
    <>
      <PageHead />

      <main>
        <Container>
          <Card body className="bg-secondary bg-opacity-10 border-0 my-2">
            <a
              href={`/activity/${hackathonName}`}
              className="text-primary"
              title={hackathonDisplayName}
            >
              {hackathonDisplayName}
            </a>
            <span className="text-secondary">{` / ${displayName}`}</span>
          </Card>

          <Row className="mt-4">
            <Col xs={12} sm={4}>
              <Card style={{ minWidth: '15rem' }}>
                <Card.Header className="bg-white">
                  <Card.Img
                    variant="top"
                    src={photo}
                    className="d-block m-auto"
                    style={{ maxWidth: '15rem' }}
                  />
                  <h1 className="h3 my-2">{displayName}</h1>
                  <p className="text-muted">{description}</p>
                </Card.Header>
                <Card.Body>
                  <h2 className="text-dark fw-bold h6 ">
                    <Icon name="people-fill" /> 团队成员
                  </h2>
                  {teamMembers.map(
                    ({ user: { photo, nickname, id } }, index) => (
                      <Col key={index} claaaName="my-3">
                        <Image
                          src={photo}
                          style={{ width: '1rem', height: '1rem' }}
                          alt={nickname}
                        />{' '}
                        <a href={`/user/${id}`} className="text-primary">
                          {nickname}
                        </a>
                      </Col>
                    ),
                  )}
                  {moreTeamMembersURL ? (
                    <Button
                      onClick={() => getMoreTeamMembers(moreTeamMembersURL)}
                      className="w-100"
                    >
                      加载更多
                    </Button>
                  ) : (
                    ''
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Accordion>
                {teamWorks?.map(
                  ({ updatedAt, id, title, description, type, url }, index) => (
                    <Accordion.Item eventKey={`${index}`} key={id}>
                      <Accordion.Header>
                        {title} -{' '}
                        {updatedAt ? updatedAt.slice(0, 10) + ' 更新' : ''}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>{description}</p>
                        {type === WorkTypeEnum.WEBSITE ||
                        type === WorkTypeEnum.POWERPOINT ||
                        type === WorkTypeEnum.WORD ? (
                          <a href={url} title={title}>
                            {title}
                          </a>
                        ) : type === WorkTypeEnum.IMAGE ? (
                          <Image src={url} className="mw-100" alt={title} />
                        ) : type === WorkTypeEnum.VIDEO ? (
                          <Ratio aspectRatio="16x9">
                            <video controls width="250">
                              <source
                                src="/media/cc0-videos/flower.webm"
                                type="video/webm"
                              />
                              Sorry, your browser doesn&apos;t support embedded
                              videos.
                            </video>
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
              {moreTeamWorksURL ? (
                <Button
                  className="w-100"
                  onClick={() => getMoreTeamWorks(moreTeamWorksURL)}
                >
                  加载更多
                </Button>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}
