import { Base, Media } from './Base';

export interface Activity extends Base {
  name: string;
  displayName: string;
  ribbon: string;
  summary: string;
  detail: string;
  location: string;
  banners: Media[];
  readOnly: boolean;
  status: 'planning' | 'pendingApproval' | 'online' | 'offline';
  creatorId: string;
  enrollment: number;
  maxEnrollment: number;
  autoApprove: boolean;
  tags: string[];
  eventStartedAt: string;
  eventEndedAt: string;
  enrollmentStartedAt: string;
  enrollmentEndedAt: string;
  judgeStartedAt: string;
  judgeEndedAt: string;
  roles: {
    isAdmin: boolean;
    isJudge: boolean;
    isEnrolled: boolean;
  };
}

export type ActivityListType =
  | 'online'
  | 'admin'
  | 'enrolled'
  | 'fresh'
  | 'created';
