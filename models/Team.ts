import { buildURLData } from 'web-utility';
import { action } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';

import { Base, Filter, createListStream } from './Base';
import { User } from './User';
import sessionStore from './Session';

export enum WorkTypeEnum {
  IMAGE = 'image',
  WEBSITE = 'website',
  VIDEO = 'video',
  WORD = 'word',
  POWERPOINT = 'powerpoint',
}

export enum MembershipStatusEnum {
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

export interface TeamWork
  extends Base,
    TeamBase,
    Record<'teamId' | 'title' | 'url', string> {
  type: WorkTypeEnum;
}

export interface TeamMember
  extends Omit<Base, 'id'>,
    Omit<TeamWork, 'type' | 'title' | 'url'> {
  userId: string;
  user: User;
  role: 'admin' | 'member';
  status: MembershipStatusEnum;
}

export class TeamModel extends Stream<Team, Filter<Team>>(ListModel) {
  client = sessionStore.client;
  currentMember?: TeamMemberModel;
  currentWork?: TeamWorkModel;

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

  openStream({ search }: Filter<Team>) {
    return createListStream<Team>(
      `${this.baseURI}s?${buildURLData({ search })}`,
      this.client,
      count => (this.totalCount = count),
    );
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
