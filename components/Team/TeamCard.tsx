import classNames from 'classnames';
import { Avatar } from 'idea-react';
import { FC, HTMLAttributes } from 'react';

import { Team } from '../../models/Activity/Team';
import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

export type TeamCardProps = HTMLAttributes<HTMLDivElement> &
  Pick<
    Team,
    'hackathonName' | 'displayName' | 'creatorId' | 'creator' | 'membersCount'
  >;

export const TeamCard: FC<TeamCardProps> = ({
  className,
  id,
  hackathonName,
  displayName,
  membersCount,
  creatorId,
  creator,
}) => (
  <div className={classNames('border p-2', className)}>
    <a
      className="fs-4 text-primary text-truncate"
      href={`/activity/${hackathonName}/team/${id}/`}
    >
      {displayName}
    </a>
    <p className="border-bottom">
      {t('a_total_of')}
      <span className="text-success mx-2">{membersCount}</span>
      {t('people')}
    </p>
    <a className="d-flex" href={`/user/${creatorId}`}>
      <span className="pe-2">{t('team_leader')}</span>

      <span className="text-primary">
        <Avatar className="me-3" size={1.5} src={creator.photo} />
        {creator.nickname}
      </span>
    </a>
  </div>
);
