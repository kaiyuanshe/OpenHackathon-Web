import { action, observable } from 'mobx';
import { ListModel, NewData, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { AwardModel } from './Award';
import { Base, createListStream, Filter, Media } from './Base';
import { Enrollment, EnrollmentModel } from './Enrollment';
<<<<<<< HEAD
import { TeamModel } from './Team';
import { MessageModel } from './Message';
=======
import { GitModel } from './Git';
>>>>>>> main
import { OrganizationModel } from './Organization';
import sessionStore from './Session';
import { StaffModel } from './Staff';

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

export interface ActivityLogsFilter extends Filter<Activity> {
  name: string;
}

export class ActivityModel extends Stream<Activity, ActivityFilter>(ListModel) {
  client = sessionStore.client;
  baseURI = 'hackathon';
  indexKey = 'name' as const;
  pageSize = 6;

  currentStaff?: StaffModel;
  currentGit = new GitModel();
  currentAward?: AwardModel;
  @observable
  currentEnrollment?: EnrollmentModel;
  currentMessage?: MessageModel;
  @observable
  currentTeam?: TeamModel;
  currentOrganization?: OrganizationModel;

  staffOf(name = this.currentOne.name) {
    return (this.currentStaff = new StaffModel(`hackathon/${name}`));
  }

  awardOf(name = this.currentOne.name) {
    return (this.currentAward = new AwardModel(`hackathon/${name}`));
  }

  enrollmentOf(name = this.currentOne.name) {
    return (this.currentEnrollment = new EnrollmentModel(`hackathon/${name}`));
  }

  messageOf(name = this.currentOne.name) {
    return (this.currentMessage = new MessageModel(`hackathon/${name}`));
  }

  teamOf(name = this.currentOne.name) {
    return (this.currentTeam = new TeamModel(`hackathon/${name}`));
  }

  organizationOf(name = this.currentOne.name) {
    return (this.currentOrganization = new OrganizationModel(
      `hackathon/${name}`,
    ));
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
    if (!name) {
      const { body } = await this.client.post<NameAvailability>(
        `${this.baseURI}/checkNameAvailability`,
        { name: data.name },
      );
      const { nameAvailable, reason, message } = body!;

      if (!nameAvailable) throw new ReferenceError(`${reason}\n${message}`);
    }
    const { body } = await (name
      ? this.client.patch<Activity>(`${this.baseURI}/${name}`, data)
      : this.client.put<Activity>(`${this.baseURI}/${data.name}`, data));

    return (this.currentOne = body!);
  }

  @action
  @toggle('downloading')
  async getOne(name: string) {
    const { detail, ...data } = await super.getOne(name);

    this.staffOf(name);
    this.awardOf(name);
    this.enrollmentOf(name);
    this.teamOf(name);
    this.organizationOf(name);
    this.messageOf(name);

    return (this.currentOne = {
      ...data,
      detail: detail
        ?.replace(/\\+n/g, '\n')
        .replace(/\\+t/g, ' ')
        .replace(/\\+"/g, '"'),
    });
  }

  @toggle('uploading')
  async publishOne(name: string, request = true) {
    await this.client.post(
      `hackathon/${name}/${request ? 'requestPublish' : 'publish'}`,
    );
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
