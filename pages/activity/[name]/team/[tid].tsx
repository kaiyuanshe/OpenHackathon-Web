import type { GetServerSidePropsContext } from 'next';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { Icon } from 'idea-react';

import PageHead from '../../../../components/PageHead';
import { TeamMemberList } from '../../../../components/Team/TeamMemberList';
import { TeamWorkList } from '../../../../components/Team/TeamWorkList';
import activityStore, { Activity } from '../../../../models/Activity';
import { Team, TeamWork, TeamMember } from '../../../../models/Team';

interface TeamPageProps {
  activity: Activity;
  team: Team;
  teamMemberList: TeamMember[];
  teamWorkList: TeamWork[];
}

export async function getServerSideProps({
  params: { name = '', tid = '' } = {},
}: GetServerSidePropsContext<{ name?: string; tid?: string }>) {
  try {
    const activity = await activityStore.getOne(name);

    const team = await activityStore.currentTeam!.getOne(tid);

    const teamMemberList =
      await activityStore.currentTeam!.currentMember!.getList();

    const teamWorkList =
      await activityStore.currentTeam!.currentWork!.getList();

    return {
      props: { activity, team, teamMemberList, teamWorkList },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as TeamPageProps,
    };
  }
}

const TeamPage = ({
  activity: { displayName: hackathonDisplayName },
  team: {
    id,
    hackathonName,
    displayName,
    description,
    creator: { photo },
  },
  teamMemberList,
  teamWorkList,
}: TeamPageProps) => (
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
            <TeamMemberList
              activity={hackathonName}
              team={id}
              value={teamMemberList}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={8}>
        <TeamWorkList activity={hackathonName} team={id} value={teamWorkList} />
      </Col>
    </Row>
  </Container>
);

export default TeamPage;
