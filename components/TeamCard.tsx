import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import { Team } from '../models/Team';

export type TeamCardProps = HTMLAttributes<HTMLDivElement> &
  Pick<
    Team,
    'hackathonName' | 'displayName' | 'creatorId' | 'creator' | 'membersCount'
  >;

export const TeamCard = ({
  className,
  id,
  hackathonName,
  displayName,
  membersCount,
  creatorId,
  creator,
}: TeamCardProps) => (
  <div className={classNames('border p-2', className)}>
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
        <img
          className="h-auto me-3"
          style={{ maxWidth: '1.5rem' }}
          alt="team-creator-photo"
          src={creator.photo}
        />
        {creator.nickname}
      </span>
    </a>
  </div>
);
