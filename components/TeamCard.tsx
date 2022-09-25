import { Image, Col } from 'react-bootstrap';

import { Team } from '../models/Team';

export const TeamCard = ({
  id,
  hackathonName,
  displayName,
  membersCount,
  creatorId,
  creator,
}: Team) => (
  <Col key={id}>
    <div className="border p-2">
      <a
        className="fs-4 text-primary text-truncate"
        href={`/activity/${hackathonName}/team/${id}/`}
      >
        {displayName}
      </a>
      <p className="border-bottom">
        共<span className="text-success mx-2">{membersCount}</span>人
      </p>
      <a className="d-flex" href={`/user/${creatorId}`}>
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
    </div>
  </Col>
);
