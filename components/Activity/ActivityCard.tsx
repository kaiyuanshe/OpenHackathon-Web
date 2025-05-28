import { faCalendarDay, faMapLocationDot, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hackathon } from '@kaiyuanshe/openhackathon-service';
import classNames from 'classnames';
import { FC, useContext } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Base/Translation';
import { convertDatetime } from '../../utils/time';
import { ActivityControl, ActivityControlProps } from './ActivityControl';
import { ActivityEntry } from './ActivityEntry';

export interface ActivityCardProps extends Hackathon, ActivityControlProps {
  className?: string;
  controls?: boolean;
}

export const ActivityCard: FC<ActivityCardProps> = ({
  className,
  controls,
  name,
  displayName,
  eventStartedAt,
  location,
  tags,
  enrollment,
  maxEnrollment,
  status,
  onPublish,
  onDelete,
  ...rest
}) => {
  const { t } = useContext(I18nContext),
    eventStartedAtText = convertDatetime(eventStartedAt);

  return (
    <Card className={classNames('border-success', className)}>
      <Card.Body>
        <Card.Title
          as="a"
          className="text-primary text-truncate text-wrap"
          title={displayName}
          href={`/activity/${name}`}
        >
          {displayName}
        </Card.Title>
        <Row as="small" className="g-4" xs={1}>
          <Col className="text-truncate border-bottom pb-2" title={eventStartedAtText}>
            <FontAwesomeIcon className="text-success" icon={faCalendarDay} /> {eventStartedAtText}
          </Col>
          <Col className="text-truncate border-bottom pb-2" title={location}>
            <FontAwesomeIcon className="text-success" icon={faMapLocationDot} /> {location}
          </Col>
        </Row>
        <Card.Text className="text-success mt-2">
          <FontAwesomeIcon className="me-2" icon={faTags} />
          {tags?.map(tag => (
            <small key={tag} className="me-2">
              {tag}
            </small>
          ))}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row as="small" className="text-muted g-4" xs={1}>
          <Col />
          <Col className="text-end">
            {enrollment} {t('people_registered')} / {t('total_people')}
            {maxEnrollment || t('unlimited')}
          </Col>
        </Row>

        {controls ? (
          <ActivityControl {...{ name, status, onPublish, onDelete }} />
        ) : (
          <ActivityEntry {...{ ...rest, status, eventStartedAt, href: `/activity/${name}` }} />
        )}
      </Card.Footer>
    </Card>
  );
};
