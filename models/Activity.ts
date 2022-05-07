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
  maxEnrollment: number | null;
  autoApprove: boolean;
  tags: string[];
  eventStartedAt: string | null;
  eventEndedAt: string | null;
  enrollmentStartedAt: string | null;
  enrollmentEndedAt: string | null;
  judgeStartedAt: string | null;
  judgeEndedAt: string | null;
  roles: {
    isAdmin: boolean;
    isJudge: boolean;
    isEnrolled: boolean;
  };
}

export type ActivityListType = 'online' | 'admin' | 'enrolled' | 'fresh';

export type ActivityFormData = Activity & {
  tagsString: string;
  bannerUrls: string[] | string;
  // bannerUrls:  string[];
};
