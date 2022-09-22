import { buildURLData } from 'web-utility';
import { ListModel, Stream, toggle } from 'mobx-restful';

import { Base, BaseFilter, Media, createListStream } from './Base';
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

export interface ActivityFilter extends BaseFilter<Activity> {
  userId?: string;
  listType?: ActivityListType;
}

export class ActivityModel extends Stream<Activity, ActivityFilter>(ListModel) {
  client = sessionStore.client;
  baseURI = 'hackathon';
  pageSize = 6;

  openStream({
    userId,
    listType = 'online',
    orderby = 'updatedAt',
  }: ActivityFilter) {
    return createListStream<Activity>(
      `${this.baseURI}s?${buildURLData({ userId, listType, orderby, top: 6 })}`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async publishOne(name: string) {
    await this.client.post(`hackathon/${name}/publish`);

    const current = this.allItems.find(({ name: n }) => n === name);

    if (current) current.status = 'online';
  }
}

export default new ActivityModel();
