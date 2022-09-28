import { buildURLData } from 'web-utility';
import { observable, action } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';

import { Base, Filter, createListStream } from './Base';
import { User } from './User';
import sessionStore from './Session';
import { NameAvailability } from './Activity';

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

export class TeamModel extends Stream<Team, TeamFilter>(ListModel) {
  client = sessionStore.client;
  currentMember?: TeamMemberModel;
  currentWork?: TeamWorkModel;

  @observable
  sessionOne?: Team;

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
      const { body } = await this.client.post<NameAvailability>(
        `${this.baseURI}/checkNameAvailability`,
        { name: data.id },
      );
      const { nameAvailable, reason, message } = body!;

      if (!nameAvailable) throw new ReferenceError(`${reason}\n${message}`);
    }
    const { body } = await (id
      ? this.client.patch<Team>(`${this.baseURI}/${id}`, data)
      : this.client.put<Team>(this.baseURI, data));

    return (this.currentOne = body!);
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

  openStream(filter: Filter<TeamMember>) {
    return createListStream<TeamMember>(
      `${this.baseURI}s?${buildURLData(filter)}`,
      this.client,
      count => (this.totalCount = count),
    );
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
