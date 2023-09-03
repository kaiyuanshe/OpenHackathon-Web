import { faAward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Avatar } from 'idea-react';
import { ScrollList } from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Accordion, Button } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { Team } from '../../models/Activity/Team';
import { i18n } from '../../models/Base/Translation';
import { TeamAwardAssignmentLayout } from './TeamAwardAssignment';
import { TeamMemberListLayout } from './TeamMemberList';
import { SimpleTeamWorkListLayout } from './TeamWork';

const { t } = i18n;

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

export class TeamAwardCard extends PureComponent<TeamAwardCardProps> {
  memberStore = activityStore
    .teamOf(this.props.hackathonName)
    .memberOf(this.props.id);

  workStore = activityStore
    .teamOf(this.props.hackathonName)
    .workOf(this.props.id);

  assignmentStore = activityStore
    .teamOf(this.props.hackathonName)
    .assignmentOf(this.props.id);

  renderDetail() {
    const { id, hackathonName, membersCount } = this.props;

    return (
      <Accordion className="my-3" flush>
        <Accordion.Item eventKey="member">
          <Accordion.Header>
            {t('member')}&nbsp;{t('a_total_of')}
            <span className="text-success mx-2">{membersCount}</span>
            {t('people')}
          </Accordion.Header>
          <Accordion.Body>
            <ScrollList
              translator={i18n}
              store={this.memberStore}
              renderList={allItems => (
                <TeamMemberListLayout defaultData={allItems} />
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="rating">
          <Accordion.Header>{t('score')}</Accordion.Header>
          <Accordion.Body></Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="work">
          <Accordion.Header>{t('work_list')}</Accordion.Header>
          <Accordion.Body>
            <ScrollList
              translator={i18n}
              store={this.workStore}
              renderList={allItems => (
                <SimpleTeamWorkListLayout size="sm" defaultData={allItems} />
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="award">
          <Accordion.Header>{t('prize_list')}</Accordion.Header>
          <Accordion.Body>
            <ScrollList
              translator={i18n}
              store={this.assignmentStore}
              renderList={allItems => (
                <TeamAwardAssignmentLayout defaultData={allItems} />
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  render() {
    const {
      className,
      id,
      hackathonName,
      displayName,
      creatorId,
      creator,
      onAssign,
    } = this.props;

    return (
      <div className={classNames('border p-2', className)}>
        <a
          className="fs-4 text-primary text-truncate"
          href={`/activity/${hackathonName}/team/${id}/`}
        >
          {displayName}
        </a>
        <a className="d-flex my-3" href={`/user/${creatorId}`}>
          <span className="pe-2">{t('team_leader')}</span>

          <span className="text-primary">
            <Avatar className="me-3" size={1.5} src={creator.photo} />
            {creator.nickname}
          </span>
        </a>
        {this.renderDetail()}

        <Button
          className="my-2 ms-3"
          variant="success"
          onClick={() => onAssign(id!)}
        >
          <FontAwesomeIcon icon={faAward} className="text-light me-2" />
          {t('prize_distribution')}
        </Button>
      </div>
    );
  }
}
