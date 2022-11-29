import { faAward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Accordion, Button, Image } from 'react-bootstrap';

import { Team } from '../../models/Team';
import { TeamAwardAssignmentList } from './TeamAwardAssignment';
import { TeamMemberList } from './TeamMemberList';
import { TeamWorkLi } from './TeamWork';

export interface TeamAwardCardProps
  extends Pick<
    Team,
    | 'hackathonName'
    | 'displayName'
    | 'creatorId'
    | 'creator'
    | 'membersCount'
    | 'id'
  > {
  className?: string;
  onAssign: (id: string) => any;
  onDelete?: (id: string) => any;
}

export const TeamAwardCard = ({
  className,
  id,
  hackathonName,
  displayName,
  membersCount,
  creatorId,
  creator,
  onAssign,
  onDelete,
}: TeamAwardCardProps) => (
  <div className={classNames('border p-2', className)}>
    <a
      className="fs-4 text-primary text-truncate"
      href={`/activity/${hackathonName}/team/${id}/`}
    >
      {displayName}
    </a>
    <a className="d-flex my-3" href={`/user/${creatorId}`}>
      <span className="pe-2">队长：</span>

      <span className="text-primary">
        <Image
          className="h-auto me-3"
          style={{ maxWidth: '1.5rem' }}
          alt="team-creator-photo"
          src={creator.photo}
        />
        {creator.nickname}
      </span>
    </a>
    <Accordion className="my-3" flush>
      <Accordion.Item eventKey="member">
        <Accordion.Header>
          队员共<span className="text-success mx-2">{membersCount}</span>人
        </Accordion.Header>
        <Accordion.Body>
          <TeamMemberList team={id} activity={hackathonName} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="rating">
        <Accordion.Header>成绩</Accordion.Header>
        <Accordion.Body></Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="work">
        <Accordion.Header>作品列表</Accordion.Header>
        <Accordion.Body>
          <TeamWorkLi team={id} activity={hackathonName} size="sm" />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="award">
        <Accordion.Header>奖项列表</Accordion.Header>
        <Accordion.Body>
          <TeamAwardAssignmentList team={id} activity={hackathonName} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    <Button
      className="my-2 ms-3"
      variant="success"
      onClick={() => onAssign(id!)}
    >
      <FontAwesomeIcon icon={faAward} className="text-light me-2" />
      奖项分配
    </Button>
  </div>
);
