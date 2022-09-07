import { useState, useEffect } from 'react';
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Card,
  Accordion,
  Ratio,
  Breadcrumb,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { Icon } from 'idea-react';

import PageHead from '../../../../../components/PageHead';
import { request, requestClient } from '../../../../api/core';
import { ListData } from '../../../../../models/Base';
import { Activity } from '../../../../../models/Activity';
import {
  WorkTypeEnum,
  Team,
  TeamWork,
  TeamMember,
} from '../../../../../models/Team';

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
    const { nextLink, value } = await requestClient<ListData<TeamWork>>(url);
    setMoreTeamWorksURL(() => nextLink || '');
    setTeamWorks(teamWorks => [...teamWorks, ...value]);
  }
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [moreTeamMembersURL, setMoreTeamMembersURL] = useState<string>('');

  async function getMoreTeamMembers(url: string) {
    const { nextLink, value } = await requestClient<ListData<TeamMember>>(url);
    setMoreTeamMembersURL(() => nextLink || '');
    setTeamMembers(teamMembers => [...teamMembers, ...value]);
  }
  async function getHackathonDisplayName() {
    const { displayName } = await requestClient<Activity>(`hackathon/${name}`);
    setHackathonDisplayName(
      hackathonDisplayName => displayName || hackathonDisplayName,
    );
  }
  const [hackathonDisplayName, setHackathonDisplayName] =
    useState<string>('活动');

  useEffect(() => {
    getMoreTeamMembers(`hackathon/${name}/team/${tid}/members`);
    getMoreTeamWorks(`hackathon/${name}/team/${tid}/works`);
    getHackathonDisplayName();
  }, []);

  return (
    <Container as="main">
      <PageHead title={`${displayName} - ${hackathonDisplayName}`} />

      <Card.Body className="bg-secondary bg-opacity-10 border-0 my-2 align-middle">
        <Breadcrumb className="pt-3">
          <Breadcrumb.Item
            className="text-primary"
            href={`/activity/${hackathonName}`}
            title={hackathonDisplayName}
          >
            {hackathonDisplayName}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{displayName}</Breadcrumb.Item>
        </Breadcrumb>
      </Card.Body>

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
              {teamMembers.map(({ user: { photo, nickname, id } }) => (
                <Col key={id} className="my-3">
                  <Image
                    src={photo}
                    style={{ width: '1rem', height: '1rem' }}
                    alt={nickname}
                  />
                  <a href={`/user/${id}`} className="ms-2 text-primary">
                    {nickname}
                  </a>
                </Col>
              ))}
              {moreTeamMembersURL && (
                <Button
                  onClick={() => getMoreTeamMembers(moreTeamMembersURL)}
                  className="w-100"
                >
                  加载更多
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Container className="mb-4" fluid="lg">
            <Tabs
              defaultActiveKey="works"
              className="w-100 mb-3 justify-content-center"
            >
              {/* <Tab eventKey="teamInfo" title="组队需求"></Tab> */}
              {/* <Tab eventKey="members" title="成员管理"></Tab> */}
              <Tab eventKey="works" title="作品管理"></Tab>
            </Tabs>
          </Container>
          <Accordion>
            <Accordion>
              <Link href={`/activity/${name}/team/${tid}/work/create`}>
                <Button variant="success" className="me-3 mb-2">
                  创建黑客松活动
                </Button>
              </Link>
              {teamWorks?.map(
                ({ updatedAt, id, title, description, type, url }, index) => (
                  <Accordion.Item eventKey={`${index}`} key={id}>
                    <Accordion.Header>
                      {title} -{' '}
                      {updatedAt ? updatedAt.slice(0, 10) + ' 更新' : ''}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Link
                        href={`/activity/${name}/team/${tid}/work/${id}/edit`}
                      >
                        <FontAwesomeIcon
                          style={{ cursor: 'pointer' }}
                          className="mb-2.5"
                          icon={faPenToSquare}
                        />
                      </Link>
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
      </Row>
    </Container>
  );
}
