import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { t } from 'i18next';
import { observer } from 'mobx-react';
import Link from 'next/link';
import {
  Accordion,
  Button,
  Card,
  Col,
  Image,
  Ratio,
  Row,
} from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { TeamWork, TeamWorkType } from '../../models/Team';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface TeamWorkListProps extends ScrollListProps<TeamWork> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  onDelete?: (id: TeamWork['id']) => any;
}

@observer
export class TeamWorkList extends ScrollList<TeamWorkListProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  extraProps: Partial<TeamWorkListProps> = {
    onDelete: id =>
      id && confirm(t('confirm_delete_work')) && this.store.deleteOne(id),
  };

  static Layout = ({
    value = [],
    size,
    onDelete,
    activity,
    team,
  }: TeamWorkListProps) => (
    <Accordion>
      <Link href={`/activity/${activity}/team/${team}/work/create`} passHref>
        <Button variant="success" className="me-3 mb-2">
          {t('submit_work')}
        </Button>
      </Link>
      <Row
        className="g-4"
        xs={1}
        sm={2}
        {...(size === 'sm'
          ? {}
          : !size
          ? { lg: 3, xxl: 4 }
          : { lg: 4, xxl: 6 })}
      >
        {value.map(({ updatedAt, id, title, description, type, url }) => (
          <Col key={id}>
            <Card className="border-success">
              <Card.Body>
                <Card.Title
                  as="a"
                  className="text-primary text-truncate"
                  title={title}
                  href={`/activity/${activity}/team/${team}/work/${id}/edit`}
                >
                  {title}
                </Card.Title>
                <p className="border-bottom p-2 text-muted text-truncate">
                  {description}
                </p>
                <Row className="border-bottom py-2 g-4">
                  {type === TeamWorkType.IMAGE ? (
                    <Image src={url} className="mw-100" alt={title} />
                  ) : type === TeamWorkType.VIDEO ? (
                    <Ratio aspectRatio="16x9">
                      <video controls width="250" src={url} />
                    </Ratio>
                  ) : (
                    <a
                      className="text-primary"
                      target="_blank"
                      href={url}
                      title={t('view_work')}
                      rel="noreferrer"
                    >
                      {t('view_work')}
                    </a>
                  )}
                </Row>
                <time
                  className="border-bottom p-2 text-truncate"
                  title={t('update_time')}
                  dateTime={updatedAt}
                >
                  <FontAwesomeIcon
                    className="text-success me-2"
                    icon={faCalendarDay}
                  />
                  {new Date(updatedAt).toLocaleString()}
                </time>
              </Card.Body>
              <Card.Footer>
                <Button
                  className="w-100 mt-2"
                  variant="danger"
                  onClick={() => onDelete?.(id)}
                >
                  {t('delete')}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Accordion>
  );
}
