import {
  Enrollment,
  Hackathon,
  HackathonStatus,
  Question,
  Questionnaire,
} from '@kaiyuanshe/openhackathon-service';
import { action, observable } from 'mobx';
import { persist, restore, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { isServer } from '../../configuration';
import { createListStream, Filter, InputData, TableModel } from '../Base';
import { GitModel } from '../Git';
import platformAdmin from '../User/PlatformAdmin';
import { AwardModel } from './Award';
import { EnrollmentModel } from './Enrollment';
import { LogModel } from './Log';
import { AnnouncementModel } from './Message';
import { OrganizerModel } from './Organization';
import { StaffModel } from './Staff';
import { TeamModel } from './Team';

export type ActivityListType = 'online' | 'admin' | 'enrolled' | 'fresh' | 'created';

export interface ActivityFilter extends Filter<Hackathon> {
  userId?: number;
  listType?: ActivityListType;
  orderby?: 'createdAt' | 'updatedAt' | 'hot';
}

export class ActivityModel extends TableModel<Hackathon, ActivityFilter> {
  baseURI = 'hackathon';
  indexKey = 'name' as const;

  restored = !isServer() && restore(this, 'Activity');

  @persist()
  @observable
  accessor currentOne = {} as Hackathon;

  currentStaff?: StaffModel;
  currentAward?: AwardModel;

  @observable
  accessor currentEnrollment: EnrollmentModel | undefined;

  currentAnnouncement?: AnnouncementModel;

  @observable
  accessor currentTeam: TeamModel | undefined;

  currentLog?: LogModel;
  currentOrganization?: OrganizerModel;
  currentTemplate?: GitModel;

  templateOf(name = this.currentOne.name) {
    return (this.currentTemplate = new GitModel(`hackathon/${name}`));
  }

  @observable
  accessor questionnaire: Question[] = [];

  staffOf(name = this.currentOne.name) {
    return (this.currentStaff = new StaffModel(`hackathon/${name}`));
  }

  awardOf(name = this.currentOne.name) {
    return (this.currentAward = new AwardModel(`hackathon/${name}`));
  }

  enrollmentOf(name = this.currentOne.name) {
    return (this.currentEnrollment = new EnrollmentModel(`hackathon/${name}`));
  }

  announcementOf(name = this.currentOne.name) {
    return (this.currentAnnouncement = new AnnouncementModel(`hackathon/${name}`));
  }

  teamOf(name = this.currentOne.name) {
    return (this.currentTeam = new TeamModel(`hackathon/${name}`));
  }

  logOf(id = this.currentOne.id) {
    return (this.currentLog = new LogModel(`Hackathon/${id}`));
  }

  organizationOf(name = this.currentOne.name) {
    return (this.currentOrganization = new OrganizerModel(`hackathon/${name}`));
  }

  openStream({ userId, listType = 'online', orderby = 'updatedAt' }: ActivityFilter) {
    return createListStream<Hackathon>(
      `${this.baseURI}s?${buildURLData({ userId, listType, orderby, top: 6 })}`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async updateOne(data: InputData<Hackathon>, name?: string) {
    if (!name) {
      const [old] = await this.getList({ name: data.name }, 1);

      if (old) throw new ReferenceError(`${data.name} is used`);
    }
    return super.updateOne(data, name);
  }

  @action
  @toggle('downloading')
  async getOne(name: string) {
    await this.restored;

    if (this.currentOne.name === name) return this.currentOne;

    const { detail, ...data } = await super.getOne(name);

    this.staffOf(name);
    this.awardOf(name);
    this.enrollmentOf(name);
    this.teamOf(name);
    this.organizationOf(name);
    this.announcementOf(name);
    this.templateOf(name);

    return (this.currentOne = {
      ...data,
      detail: detail?.replace(/\\+n/g, '\n').replace(/\\+t/g, ' ').replace(/\\+"/g, '"'),
    });
  }

  editQuestionnaireStatus(questionnaire: Question[]) {
    return (this.questionnaire = questionnaire);
  }

  @toggle('downloading')
  async getQuestionnaire(activity = this.currentOne.name) {
    const { body } = await this.client.get<Questionnaire>(
      `${this.baseURI}/${activity}/questionnaire`,
    );
    return (this.questionnaire = body!.questions);
  }

  @toggle('uploading')
  updateQuestionnaire(questions: Question[], activity = this.currentOne.name) {
    return this.client.put(`${this.baseURI}/${activity}/questionnaire`, {
      questions,
    });
  }

  @toggle('uploading')
  async publishOne(name: string) {
    const isPlatformAdmin = await platformAdmin.checkAuthorization(),
      status = (isPlatformAdmin ? 'online' : 'pendingApproval') as HackathonStatus;

    await this.client.patch(`hackathon/${name}`, { status });

    this.changeOne({ status }, name, true);
  }

  @toggle('uploading')
  async signOne(name: string, form: Enrollment['form'] = []) {
    await this.client.put(`${this.baseURI}/${name}/enrollment`, { form });

    return this.currentEnrollment?.getSessionOne();
  }
}

export default new ActivityModel();
