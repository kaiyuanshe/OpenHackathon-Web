import { action, observable } from 'mobx';
import { Stream, toggle } from 'mobx-restful';
import { StrapiListModel } from 'mobx-strapi';
import { buildURLData } from 'web-utility';

import { Base, createListStream, Filter, InputData, Media } from '../Base';
import { GitModel } from '../Git';
import { GitTemplateModal } from '../TemplateRepo';
import platformAdmin from '../User/PlatformAdmin';
import sessionStore, { strapiClient } from '../User/Session';
import { AwardModel } from './Award';
import { Enrollment, EnrollmentModel } from './Enrollment';
import { LogModel } from './Log';
import { MessageModel } from './Message';
import { OrganizationModel } from './Organization';
import { Extensions, Question } from './Question';
import { StaffModel } from './Staff';
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
  roles: null | {
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
  orderby?: 'createdAt' | 'updatedAt' | 'hot';
}

export interface ActivityLogsFilter extends Filter<Activity> {
  name: string;
}

export interface Questionnaire extends Base {
  extensions: Extensions[];
  hackathonName: string;
}

export class ActivityModel extends Stream<Activity, ActivityFilter>(
  StrapiListModel,
) {
  client = strapiClient;
  baseURI = 'hackathon';
  indexKey = 'name' as const;

  currentStaff?: StaffModel;
  currentGit = new GitModel();
  currentAward?: AwardModel;

  @observable
  accessor currentEnrollment: EnrollmentModel | undefined;

  currentMessage?: MessageModel;

  @observable
  accessor currentTeam: TeamModel | undefined;

  currentLog?: LogModel;
  currentOrganization?: OrganizationModel;
  currentTemplate?: GitTemplateModal;

  templateOf(name = this.currentOne.name) {
    return (this.currentTemplate = new GitTemplateModal(`hackathon/${name}`));
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

  messageOf(name = this.currentOne.name) {
    return (this.currentMessage = new MessageModel(`hackathon/${name}`));
  }

  teamOf(name = this.currentOne.name) {
    return (this.currentTeam = new TeamModel(`hackathon/${name}`));
  }

  logOf(name = this.currentOne.name) {
    return (this.currentLog = new LogModel(`hackathon/${name}`));
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
  async updateOne(data: InputData<Activity>, name?: string) {
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
    this.templateOf(name);

    return (this.currentOne = {
      ...data,
      detail: detail
        ?.replace(/\\+n/g, '\n')
        .replace(/\\+t/g, ' ')
        .replace(/\\+"/g, '"'),
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
    const questionnaire = body!.extensions.map(
      v =>
        ({
          ...JSON.parse(v.value),
          id: v.name,
        }) as Question,
    );

    return (this.questionnaire = questionnaire);
  }

  @toggle('uploading')
  createQuestionnaire(
    extensions: Extensions[],
    activity = this.currentOne.name,
  ) {
    return this.client.put(`${this.baseURI}/${activity}/questionnaire`, {
      extensions,
    });
  }

  @toggle('uploading')
  updateQuestionnaire(
    extensions: Extensions[],
    activity = this.currentOne.name,
  ) {
    return this.client.patch(`${this.baseURI}/${activity}/questionnaire`, {
      extensions,
    });
  }

  @toggle('uploading')
  async deleteQuestionnaire(name: string) {
    await this.client.delete(`${this.baseURI}/${name}/questionnaire`);

    return (this.questionnaire = []);
  }

  @toggle('uploading')
  async publishOne(name: string) {
    const isPlatformAdmin = await platformAdmin.checkAuthorization();

    await this.client.post(
      `hackathon/${name}/${isPlatformAdmin ? 'publish' : 'requestPublish'}`,
    );
    this.changeOne({ status: 'online' }, name, true);
  }

  @toggle('uploading')
  async signOne(name: string, extensions: Enrollment['extensions'] = []) {
    await this.client.put(`${this.baseURI}/${name}/enrollment`, {
      extensions,
    });

    return this.currentEnrollment?.getSessionOne();
  }
}

export default new ActivityModel();
