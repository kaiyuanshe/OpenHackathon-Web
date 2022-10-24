import {
  faCalendarDay,
  faMapLocationDot,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { t } from 'i18next';
import Link from 'next/link';
import { Card, Col, Row } from 'react-bootstrap';

import { Activity } from '../../models/Activity';
import { convertDatetime } from '../../utils/time';
import { ActivityControl, ActivityControlProps } from './ActivityControl';
import { ActivityEntry } from './ActivityEntry';

export interface ActivityCardProps extends Activity, ActivityControlProps {
  className?: string;
  controls?: boolean;
}

export function ActivityCard({
  className,
  controls,
  name,
  displayName,
  eventStartedAt,
  location,
  tags,
  enrollment,
  status,
  onPublish,
  onDelete,
  ...rest
}: ActivityCardProps) {
  const eventStartedAtText = convertDatetime(eventStartedAt);

  return (
    <Card className={classNames('border-success', className)}>
      <Card.Body>
        <Card.Title className="text-primary text-truncate" title={displayName}>
          <Link href={`/activity/${name}`}>{displayName}</Link>
        </Card.Title>
        <Row as="small" className="border-bottom py-2 g-4" xs={1} sm={2}>
          <Col className="text-truncate" title={eventStartedAtText}>
            <FontAwesomeIcon className="text-success" icon={faCalendarDay} />{' '}
            {eventStartedAtText}
          </Col>
          <Col className="text-truncate" title={location}>
            <FontAwesomeIcon className="text-success" icon={faMapLocationDot} />{' '}
            {location}
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
        <Row as="small" className="text-muted g-4" xs={1} sm={2}>
          <Col></Col>
          <Col className="text-end">
            {enrollment} {t('people_registered')}
          </Col>
        </Row>

        {controls ? (
          <ActivityControl {...{ name, status, onPublish, onDelete }} />
        ) : (
          <ActivityEntry
            {...{ ...rest, status, eventStartedAt, href: `/activity/${name}` }}
          />
        )}
      </Card.Footer>
    </Card>
  );
}
