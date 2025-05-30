import { Hackathon } from '@kaiyuanshe/openhackathon-service';
import { FC, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { diffTime } from 'web-utility';

import { i18n, I18nContext } from '../../models/Base/Translation';

export type ActivityStatusMeta = Pick<
  Hackathon,
  | 'status'
  | 'enrollmentStartedAt'
  | 'enrollmentEndedAt'
  | 'eventStartedAt'
  | 'eventEndedAt'
  | 'judgeStartedAt'
  | 'judgeEndedAt'
>;

export const getActivityStatusText = (
  { t }: typeof i18n,
  {
    status,
    enrollmentStartedAt,
    enrollmentEndedAt,
    eventStartedAt,
    eventEndedAt,
    judgeStartedAt,
    judgeEndedAt,
  }: ActivityStatusMeta,
) => {
  const now = Date.now(),
    isOnline = status === 'online',
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    eventStart = new Date(eventStartedAt),
    eventEnd = new Date(eventEndedAt),
    judgeStart = new Date(judgeStartedAt),
    judgeEnd = new Date(judgeEndedAt),
    enrollmentDiff = diffTime(enrollmentStart, new Date());

  return !isOnline
    ? t('pending_review')
    : now < +enrollmentStart
      ? t('register_after', enrollmentDiff)
      : now < +enrollmentEnd
        ? t('accepting_applications')
        : now < +eventStart
          ? t('registration_deadline')
          : now < +eventEnd
            ? t('in_progress')
            : now < +judgeStart
              ? t('submit_work_deadline')
              : now < +judgeEnd
                ? t('judges_review')
                : t('activity_ended');
};

export interface ActivityEntryProps extends ActivityStatusMeta {
  href: string;
}

export const ActivityEntry: FC<ActivityEntryProps> = ({
  status,
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
  href,
}) => {
  const i18n = useContext(I18nContext),
    now = Date.now(),
    isOnline = status === 'online',
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    enrolling = isOnline && +enrollmentStart < now && now < +enrollmentEnd;

  return (
    <Button className="my-2 w-100" variant="primary" href={href} disabled={!enrolling}>
      {getActivityStatusText(i18n, {
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
};
