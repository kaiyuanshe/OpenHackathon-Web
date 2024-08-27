import {
  Base,
  Enrollment,
  Hackathon,
  HackathonStatus,
} from '@kaiyuanshe/openhackathon-service';
import { action, observable } from 'mobx';
import { toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { createListStream, Filter, InputData, TableModel } from '../Base';
import { GitModel } from '../Git';
import { GitTemplateModal } from '../TemplateRepo';
import platformAdmin from '../User/PlatformAdmin';
import { AwardModel } from './Award';
import { EnrollmentModel } from './Enrollment';
import { LogModel } from './Log';
import { MessageModel } from './Message';
import { OrganizerModel } from './Organization';
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

export class ActivityModel extends TableModel<Hackathon, ActivityFilter> {
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
  currentOrganization?: OrganizerModel;
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

  logOf(id = this.currentOne.id) {
    return (this.currentLog = new LogModel(`Hackathon/${id}`));
  }

  organizationOf(name = this.currentOne.name) {
    return (this.currentOrganization = new OrganizerModel(`hackathon/${name}`));
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
      const [old] = await this.getList({ name: data.name }, 1);

      if (old) throw new ReferenceError(`${data.name} is used`);
    }
    return super.updateOne(data, name);
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
