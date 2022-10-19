import { action, computed, observable } from 'mobx';
import { ListModel, NewData, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { NameAvailability } from './Activity';
import { Base, createListStream, Filter, integrateError } from './Base';
import { WorkspaceModel } from './Git';
import sessionStore from './Session';
import { User } from './User';

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
  client = sessionStore.client;
  currentMember?: TeamMemberModel;
  currentWork?: TeamWorkModel;
  currentWorkspace?: WorkspaceModel;

  @observable
  sessionOne?: Team;

  @computed
  get exportURL() {
    return sessionStore.exportURLOf('teams', this.baseURI);
  }

  @computed
  get workExportURL() {
    return sessionStore.exportURLOf('teamWorks', this.baseURI);
  }

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/team`;
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
  async updateOne(data: NewData<Team>, id?: string) {
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
        const errMsg = message.replace('{0}', data.displayName || '');
        throw new ReferenceError(`${reason}\n${errMsg}`);
      }
    }
    try {
      const { body } = await (id
        ? this.client.patch<Team>(`${this.baseURI}/${id}`, data)
        : this.client.put<Team>(this.baseURI, data));

      return (this.currentOne = body!);
    } catch (error: any) {
      throw integrateError(error);
    }
  }
}

export class TeamMemberModel extends Stream<TeamMember, Filter<TeamMember>>(
  ListModel,
) {
  client = sessionStore.client;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/member`;
  }

  @observable
  sessionOne?: TeamMember;

  openStream(filter: Filter<TeamMember>) {
    return createListStream<TeamMember>(
      `${this.baseURI}s?${buildURLData(filter)}`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  joinTeam(body: JoinTeamReqBody) {
    return this.client.put<TeamMember>(this.baseURI, body);
  }

  @toggle('uploading')
  leaveTeam() {
    return this.client.delete(this.baseURI);
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
}
