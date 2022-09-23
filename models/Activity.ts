import { buildURLData } from 'web-utility';
import { action } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';

import { Base, Filter, Media, createListStream } from './Base';
import sessionStore from './Session';
import { AwardModel } from './Award';
import { Enrollment } from './Enrollment';
import { TeamModel } from './Team';

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

export interface ActivityFilter extends Filter<Activity> {
  userId?: string;
  listType?: ActivityListType;
}

export class ActivityModel extends Stream<Activity, ActivityFilter>(ListModel) {
  client = sessionStore.client;
  baseURI = 'hackathon';
  indexKey = 'name' as const;
  pageSize = 6;

  currentAward?: AwardModel;
  currentTeam?: TeamModel;

  awardOf(name = this.currentOne.name) {
    return (this.currentAward = new AwardModel(`hackathon/${name}`));
  }

  teamOf(name = this.currentOne.name) {
    return (this.currentTeam = new TeamModel(`hackathon/${name}`));
  }

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
  async updateOne(data: NewData<Activity>, name?: string) {
    const { body } = await (name
      ? this.client.put<Activity>(`${this.baseURI}/${name}`, data)
      : this.client.post<Activity>(this.baseURI, data));

    return (this.currentOne = body!);
  }

  @action
  @toggle('downloading')
  async getOne(name: string) {
    const { detail, ...data } = await super.getOne(name);

    this.awardOf(name);
    this.teamOf(name);

    return (this.currentOne = {
      ...data,
      detail: detail
        ?.replace(/\\+n/g, '\n')
        .replace(/\\+t/g, ' ')
        .replace(/\\+"/g, '"'),
    });
  }

  @toggle('uploading')
  async publishOne(name: string) {
    await this.client.post(`hackathon/${name}/publish`);
    // @ts-ignore
    this.changeOne({ status: 'online' }, name, true);
  }

  @toggle('uploading')
  signOne(name: string, extensions: Enrollment['extensions']) {
    return this.client.put(`${this.baseURI}/${name}/enrollment`, {
      extensions,
    });
  }
}

export default new ActivityModel();
