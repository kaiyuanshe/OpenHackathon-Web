import { action, computed, makeObservable, observable } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import {
  Base,
  createListStream,
  Filter,
  InputData,
  integrateError,
} from '../Base';
import { WorkspaceModel } from '../Git';
import { User } from '../User';
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

export interface Team
  extends Base,
    TeamBase,
    Record<'displayName' | 'creatorId', string> {
  id: string;
  autoApprove: boolean;
  creator: User;
  membersCount: number;
}

export interface TeamFilter extends Filter<Team> {
  search?: string;
}

export type TeamMemberFilter = Filter<TeamMember> &
  Partial<Pick<TeamMember, 'role' | 'status'>>;

export interface TeamWork
  extends Base,
    TeamBase,
    Record<'teamId' | 'title' | 'url', string> {
  type: TeamWorkType;
}

export interface TeamMember
  extends Omit<Base, 'id'>,
    Omit<TeamWork, 'type' | 'title' | 'url'> {
  userId: string;
  user: User;
  role: 'admin' | 'member';
  status: MembershipStatus;
}

export interface JoinTeamReqBody extends Pick<TeamMember, 'role'> {
  description?: string;
}

export class TeamModel extends Stream<Team, TeamFilter>(ListModel) {
  constructor(baseURI: string) {
    super();
    makeObservable(this);

    this.baseURI = `${baseURI}/team`;
  }

  client = sessionStore.client;
  currentMember?: TeamMemberModel;
  currentWork?: TeamWorkModel;
  currentWorkspace?: WorkspaceModel;
  currentAssignment?: TeamAssignmentModel;

  @observable
  sessionOne?: Team = undefined;

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

  openStream({ search }: TeamFilter) {
    return createListStream<Team>(
      `${this.baseURI}s?${buildURLData({ search })}`,
      this.client,
      count => (this.totalCount = count),
    );
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

export class TeamMemberModel extends Stream<TeamMember, Filter<TeamMember>>(
  ListModel,
) {
  constructor(baseURI: string) {
    super();
    makeObservable(this);

    this.baseURI = `${baseURI}/member`;
  }

  client = sessionStore.client;

  @observable
  sessionOne?: TeamMember = undefined;

  openStream(filter: Filter<TeamMember>) {
    return createListStream<TeamMember>(
      `${this.baseURI}s?${buildURLData(filter)}`,
      this.client,
      count => (this.totalCount = count),
    );
  }

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

  @toggle('uploading')
  async approveOne(userId: string, status: MembershipStatus) {
    if (status !== MembershipStatus.APPROVED) return;
    await this.client.post<TeamMember>(`${this.baseURI}/${userId}/approve`, {});
    this.changeOne({ status }, userId, true);
  }

  @toggle('uploading')
  async updateRole(userId: string, role: Required<TeamMemberFilter>['role']) {
    await this.client.post<TeamMember>(`${this.baseURI}/${userId}/updateRole`, {
      role,
    });
    this.changeOne({ role }, userId, true);
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
