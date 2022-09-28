import { diffTime } from 'web-utility';
import { Button } from 'react-bootstrap';

import { TimeUnit } from '../../utils/time';
import { Activity } from '../../models/Activity';

export type ActivityStatusTextProps = Pick<
  Activity,
  | 'status'
  | 'enrollmentStartedAt'
  | 'enrollmentEndedAt'
  | 'eventStartedAt'
  | 'eventEndedAt'
  | 'judgeStartedAt'
  | 'judgeEndedAt'
>;

export const getActivityStatusText = ({
  status,
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
}: ActivityStatusTextProps) => {
  const now = Date.now(),
    isOnline = status === 'online',
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    eventStart = new Date(eventStartedAt),
    eventEnd = new Date(eventEndedAt),
    judgeStart = new Date(judgeStartedAt),
    judgeEnd = new Date(judgeEndedAt),
    enrollmentDiff = diffTime(enrollmentStart, new Date(), TimeUnit);

  return !isOnline
    ? '未上线，待审核'
    : now < +enrollmentStart
    ? `${enrollmentDiff.distance} ${enrollmentDiff.unit}后开始报名`
    : now < +enrollmentEnd
    ? '正在报名'
    : now < +eventStart
    ? '报名截止'
    : now < +eventEnd
    ? '比赛进行中'
    : now < +judgeStart
    ? '作品提交截止'
    : now < +judgeEnd
    ? '评委审核中'
    : '比赛结束';
};
export interface ActivityEntryProps extends ActivityStatusTextProps {
  href: string;
}

export function ActivityEntry({
  status,
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
  href,
}: ActivityEntryProps) {
  const now = Date.now(),
    isOnline = status === 'online',
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    enrolling = isOnline && +enrollmentStart < now && now < +enrollmentEnd;

  return (
    <Button
      className="my-2 w-100"
      variant="primary"
      href={href}
      disabled={!enrolling}
    >
      {getActivityStatusText({
        status,
        enrollmentStartedAt,
        enrollmentEndedAt,
        eventStartedAt,
        eventEndedAt,
        judgeStartedAt,
        judgeEndedAt,
      })}
    </Button>
  );
}
