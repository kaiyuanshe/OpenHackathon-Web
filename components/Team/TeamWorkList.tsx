import { observer } from 'mobx-react';
import { Ratio, Image, Accordion, Button } from 'react-bootstrap';

import { ScrollListProps, ScrollList } from '../ScrollList';
import { TeamWork, TeamWorkType } from '../../models/Team';
import activityStore from '../../models/Activity';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export interface TeamWorkListProps extends ScrollListProps<TeamWork> {
  activity: string;
  team: string;
}

@observer
export class TeamWorkList extends ScrollList<TeamWorkListProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  static Layout = ({ value = [], activity, team }: TeamWorkListProps) => (
    <Accordion>
      <Link href={`/activity/${activity}/team/${team}/work/create`}>
        <Button variant="success" className="me-3 mb-2">
          创建黑客松活动
        </Button>
      </Link>
      {value.map(({ updatedAt, id, title, description, type, url }) => (
        <Accordion.Item eventKey={id!} key={id}>
          <Accordion.Header>
            {title} - {updatedAt ? updatedAt.slice(0, 10) + ' 更新' : ''}
          </Accordion.Header>
          <Accordion.Body>
            <Link href={`/activity/${activity}/team/${team}/work/${id}/edit`}>
              <FontAwesomeIcon
                style={{ cursor: 'pointer' }}
                className="mb-2.5"
                icon={faPenToSquare}
              />
            </Link>
            <p>{description}</p>
            {type === TeamWorkType.IMAGE ? (
              <Image src={url} className="mw-100" alt={title} />
            ) : type === TeamWorkType.VIDEO ? (
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
      ))}
    </Accordion>
  );
}
