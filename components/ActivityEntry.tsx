import { diffTime } from 'web-utility';
import { Button } from 'react-bootstrap';

import { TimeUnit } from '../utils/time';
import { Activity } from '../models/Activity';

export interface ActivityEntryProps
  extends Pick<
    Activity,
    | 'enrollmentStartedAt'
    | 'enrollmentEndedAt'
    | 'eventStartedAt'
    | 'eventEndedAt'
    | 'judgeStartedAt'
    | 'judgeEndedAt'
  > {
  href: string;
}

export function ActivityEntry({
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
  href,
}: ActivityEntryProps) {
  const now = Date.now(),
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    eventStart = new Date(eventStartedAt),
    eventEnd = new Date(eventEndedAt),
    judgeStart = new Date(judgeStartedAt),
    judgeEnd = new Date(judgeEndedAt);
  const enrolling = +enrollmentStart < now && now < +enrollmentEnd,
    enrollmentDiff = diffTime(enrollmentStart, new Date(), TimeUnit);

  return (
    <Button
      className="my-2 w-100"
      variant="primary"
      href={href}
      disabled={!enrolling}
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
  );
}
