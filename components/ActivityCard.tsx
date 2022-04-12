import { diffTime } from 'web-utility';
import classNames from 'classnames';
import Link from 'next/link';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faMapLocationDot,
  faTags,
} from '@fortawesome/free-solid-svg-icons';

import { TimeUnit } from './time';
import { Activity } from '../models/Activity';

export interface ActivityCardProps extends Activity {
  className: string;
}

export function ActivityCard({
  className,
  name,
  displayName,
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
  location,
  tags,
  enrollment,
}: ActivityCardProps) {
  const now = Date.now(),
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    eventStart = new Date(eventStartedAt),
    eventEnd = new Date(eventEndedAt),
    judgeStart = new Date(judgeStartedAt),
    judgeEnd = new Date(judgeEndedAt);
  const eventStartedAtText = eventStart.toLocaleString(),
    enrollmentDiff = diffTime(enrollmentStart, new Date(), TimeUnit);

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
          <Col className="text-end">{enrollment}人已报名</Col>
        </Row>
        <Button
          className="my-2 w-100"
          variant={
            +enrollmentStart < now && now < +enrollmentEnd
              ? 'primary'
              : 'secondary'
          }
          href={`/activity/${name}`}
        >
          {now < +enrollmentStart
            ? `${enrollmentDiff.distance} ${enrollmentDiff.unit}后开始报名`
            : now < +enrollmentEnd
            ? '立即报名'
            : now < +eventStart
            ? '报名截止'
            : now < +eventEnd
            ? '比赛进行中'
            : now < +judgeStart
            ? '作品提交截止'
            : now < +judgeEnd
            ? '评委审核中'
            : '比赛结束'}
        </Button>
      </Card.Footer>
    </Card>
  );
}
