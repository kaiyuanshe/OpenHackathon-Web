import { ListModel, Stream } from 'mobx-restful';

import { Base, Media, createListStream } from './Base';
import sessionStore from './Session';

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
  maxEnrollment?: number;
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

export interface NameAvailability {
  name: string;
  nameAvailable: boolean;
  reason: string;
  message: string;
}

export class ActivityModel extends Stream<Activity>(ListModel) {
  client = sessionStore.client;
  baseURI = 'hackathon';
  pageSize = 6;

  openStream() {
    return createListStream<Activity>(
      `${this.baseURI}s?top=6`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}

export default new ActivityModel();
