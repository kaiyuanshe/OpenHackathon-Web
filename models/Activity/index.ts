import type {
  Base,
  Hackathon,
  HackathonStatus,
} from '@kaiyuanshe/openhackathon-service';
import { action, observable } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { createListStream, Filter, InputData } from '../Base';
import { GitModel } from '../Git';
import { GitTemplateModal } from '../TemplateRepo';
import platformAdmin from '../User/PlatformAdmin';
import sessionStore from '../User/Session';
import { AwardModel } from './Award';
import { Enrollment, EnrollmentModel } from './Enrollment';
import { LogModel } from './Log';
import { MessageModel } from './Message';
import { OrganizationModel } from './Organization';
import { Extensions, Question } from './Question';
import { StaffModel } from './Staff';
import { TeamModel } from './Team';

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

export interface ActivityFilter extends Filter<Hackathon> {
  userId?: number;
  listType?: ActivityListType;
  orderby?: 'createdAt' | 'updatedAt' | 'hot';
}

export interface ActivityLogsFilter extends Filter<Hackathon> {
  name: string;
}

export interface Questionnaire extends Base {
  extensions: Extensions[];
  hackathonName: string;
}

export class ActivityModel extends Stream<Hackathon, ActivityFilter>(
  ListModel,
) {
  client = sessionStore.client;
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
    return createListStream<Hackathon>(
      `${this.baseURI}s?${buildURLData({ userId, listType, orderby, top: 6 })}`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async updateOne(data: InputData<Hackathon>, name?: string) {
    if (!name) {
      const { body } = await this.client.post<NameAvailability>(
        `${this.baseURI}/checkNameAvailability`,
        { name: data.name },
      );
      const { nameAvailable, reason, message } = body!;

      if (!nameAvailable) throw new ReferenceError(`${reason}\n${message}`);
    }
    const { body } = await (name
      ? this.client.patch<Hackathon>(`${this.baseURI}/${name}`, data)
      : this.client.put<Hackathon>(`${this.baseURI}/${data.name}`, data));

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
    this.changeOne({ status: 'online' as HackathonStatus.Online }, name, true);
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
