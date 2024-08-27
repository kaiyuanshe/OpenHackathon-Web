import {
  Base,
  BaseFilter,
  Team,
  TeamMember,
  TeamMemberFilter,
} from '@kaiyuanshe/openhackathon-service';
import { action, computed, observable } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';

import {
  createListStream,
  Filter,
  InputData,
  integrateError,
  TableModel,
} from '../Base';
import { WorkspaceModel } from '../Git';
import sessionStore from '../User/Session';
import { AwardAssignment } from './Award';
import { NameAvailability } from './index';

export enum TeamWorkType {
  IMAGE = 'image',
  WEBSITE = 'website',
  VIDEO = 'video',
  WORD = 'word',
  POWERPOINT = 'powerpoint',
}

export enum MembershipStatus {
  PENDINGAPPROVAL = 'pendingApproval',
  APPROVED = 'approved',
}

type TeamBase = Record<'hackathonName' | 'description', string>;

export type TeamFilter = Filter<Team> & BaseFilter;

export type MemberFilter = Filter<TeamMember> & TeamMemberFilter;

export interface TeamWork
  extends Base,
    TeamBase,
    Record<'teamId' | 'title' | 'url', string> {
  type: TeamWorkType;
}

export interface JoinTeamReqBody extends Pick<TeamMember, 'role'> {
  description?: string;
}

export class TeamModel extends TableModel<Team, TeamFilter> {
  constructor(public baseURI: string) {
    super();

    this.baseURI = `${baseURI}/team`;
  }

  currentMember?: TeamMemberModel;
  currentWork?: TeamWorkModel;
  currentWorkspace?: WorkspaceModel;
  currentAssignment?: TeamAssignmentModel;

  @observable
  accessor sessionOne: Team | undefined;

  @computed
  get exportURL() {
    return sessionStore.exportURLOf('teams', this.baseURI);
  }

  @computed
  get workExportURL() {
    return sessionStore.exportURLOf('teamWorks', this.baseURI);
  }

  memberOf(tid = this.currentOne.id) {
    return (this.currentMember = new TeamMemberModel(`${this.baseURI}/${tid}`));
  }

  workOf(tid = this.currentOne.id) {
    return (this.currentWork = new TeamWorkModel(`${this.baseURI}/${tid}`));
  }

  workspaceOf(tid = this.currentOne.id) {
    return (this.currentWorkspace = new WorkspaceModel(
      `${this.baseURI}/${tid}`,
    ));
  }

  assignmentOf(tid = this.currentOne.id) {
    return (this.currentAssignment = new TeamAssignmentModel(
      `${this.baseURI}/${tid}`,
    ));
  }

  @action
  @toggle('downloading')
  async getOne(id: Team['id']) {
    const team = await super.getOne(id);

    this.memberOf();
    this.workOf();

    return team;
  }

  @toggle('downloading')
  async getSessionOne() {
    const { body } = await this.client.get<Team>(this.baseURI);

    return (this.sessionOne = body!);
  }

  @toggle('uploading')
  async updateOne(data: InputData<Team>, id?: string) {
    if (!id) {
      try {
        var { body: checkNameAvailabilityBody } =
          await this.client.post<NameAvailability>(
            `${this.baseURI}/checkNameAvailability`,
            { name: data.displayName },
          );
      } catch (error: any) {
        throw integrateError(error);
      }
      const { nameAvailable, reason, message } = checkNameAvailabilityBody!;

      if (!nameAvailable) {
        const text = message.replace('{0}', data.displayName || '');

        throw new ReferenceError(`${reason}\n${text}`);
      }
    }

    try {
      const { body } = await (id
        ? this.client.patch<Team>(`${this.baseURI}/${id}`, data)
        : this.client.put<Team>(this.baseURI, data));

      await this.getSessionOne();

      return (this.currentOne = body!);
    } catch (error: any) {
      throw integrateError(error);
    }
  }
}

export class TeamMemberModel extends TableModel<TeamMember, MemberFilter> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/member`;
  }

  @observable
  accessor sessionOne: TeamMember | undefined;

  @toggle('uploading')
  async joinTeam(data: JoinTeamReqBody) {
    const { body } = await this.client.put<TeamMember>(this.baseURI, data);

    return (this.currentOne = body!);
  }

  @toggle('uploading')
  async leaveTeam() {
    await this.client.delete(this.baseURI);

    this.currentOne = {} as TeamMember;
  }
}

export class TeamWorkModel extends Stream<TeamWork>(ListModel) {
  client = sessionStore.client;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/work`;
  }

  openStream() {
    return createListStream<TeamWork>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async updateOne(data: InputData<TeamWork>, id?: string) {
    const { body } = await (id
      ? this.client.patch<TeamWork>(`${this.baseURI}/${id}`, data)
      : this.client.put<TeamWork>(this.baseURI, data));

    return (this.currentOne = body!);
  }
}

export class TeamAssignmentModel extends Stream<AwardAssignment>(ListModel) {
  client = sessionStore.client;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/assignment`;
  }

  openStream() {
    return createListStream<AwardAssignment>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}
