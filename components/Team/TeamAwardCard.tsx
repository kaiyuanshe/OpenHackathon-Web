import { faAward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Base, Team } from '@kaiyuanshe/openhackathon-service';
import classNames from 'classnames';
import { Avatar } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { Component } from 'react';
import { Accordion, Button } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { i18n, t } from '../../models/Base/Translation';
import { TeamAwardAssignmentLayout } from './TeamAwardAssignment';
import { TeamMemberListLayout } from './TeamMemberList';
import { SimpleTeamWorkListLayout } from './TeamWork';

export interface TeamAwardCardProps
  extends Omit<Team, Exclude<keyof Base, 'id'>> {
  className?: string;
  onAssign: (id: number) => any;
  onDelete?: (id: number) => any;
}

@observer
export class TeamAwardCard extends Component<TeamAwardCardProps> {
  memberStore = activityStore
    .teamOf(this.props.hackathon.name)
    .memberOf(this.props.id);

  workStore = activityStore
    .teamOf(this.props.hackathon.name)
    .workOf(this.props.id);

  assignmentStore = activityStore
    .teamOf(this.props.hackathon.name)
    .assignmentOf(this.props.id);

  renderDetail() {
    const { membersCount } = this.props;

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
          <Accordion.Body />
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
      hackathon: { name },
      displayName,
      createdBy,
      onAssign,
    } = this.props;

    return (
      <div className={classNames('border p-2', className)}>
        <a
          className="fs-4 text-primary text-truncate"
          href={`/activity/${name}/team/${id}/`}
        >
          {displayName}
        </a>
        <a className="d-flex my-3" href={`/user/${createdBy.id}`}>
          <span className="pe-2">{t('team_leader')}</span>

          <span className="text-primary">
            <Avatar className="me-3" size={1.5} src={createdBy.avatar} />
            {createdBy.name}
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
