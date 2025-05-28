import { Base, Team } from '@kaiyuanshe/openhackathon-service';
import classNames from 'classnames';
import { Avatar } from 'idea-react';
import { observer } from 'mobx-react';
import { FC, HTMLAttributes, useContext } from 'react';

import { I18nContext } from '../../models/Base/Translation';

export type TeamCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> &
  Omit<Team, Exclude<keyof Base, 'id'>>;

export const TeamCard: FC<TeamCardProps> = observer(
  ({ className, id, hackathon: { name }, displayName, membersCount, createdBy }) => {
    const { t } = useContext(I18nContext);

    return (
      <div className={classNames('border p-2', className)}>
        <a className="fs-4 text-primary text-truncate" href={`/activity/${name}/team/${id}/`}>
          {displayName}
        </a>
        <p className="border-bottom">
          {t('a_total_of')}
          <span className="text-success mx-2">{membersCount}</span>
          {t('people')}
        </p>
        <a className="d-flex" href={`/user/${createdBy.id}`}>
          <span className="pe-2">{t('team_leader')}</span>

          <span className="text-primary">
            <Avatar className="me-3" size={1.5} src={createdBy.avatar} />
            {createdBy.name}
          </span>
        </a>
      </div>
    );
  },
);
