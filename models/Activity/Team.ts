import {
  BaseFilter,
  Team,
  TeamMember,
  TeamMemberFilter,
  TeamWork,
  TeamWorkFilter,
} from '@kaiyuanshe/openhackathon-service';
import { action, computed, observable } from 'mobx';
import { ListModel, persist, restore, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { isServer } from '../../configuration';
import { createListStream, Filter, InputData, TableModel } from '../Base';
import { WorkspaceModel } from '../Git';
import sessionStore from '../User/Session';
import { AwardAssignment } from './Award';
import { EvaluationModel } from './Evaluation';

export type TeamFilter = Filter<Team> & BaseFilter;

export type MemberFilter = Filter<TeamMember> & TeamMemberFilter;

export type WorkFilter = Filter<TeamWork> & TeamWorkFilter;

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
    return (this.currentWorkspace = new WorkspaceModel(`${this.baseURI}/${tid}`));
  }

  @computed
  get currentEvaluation() {
    const { hackathon, id } = this.currentOne;

    return new EvaluationModel(hackathon.name, id);
  }

  assignmentOf(tid = this.currentOne.id) {
    return (this.currentAssignment = new TeamAssignmentModel(`${this.baseURI}/${tid}`));
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
      const { body } = await this.client.get<Team[]>(
        `${this.baseURI}?${buildURLData({ displayName: data.displayName })}`,
      );
      if (body![0]) throw new ReferenceError(`${data.displayName} is used`);
    }
    const team = await super.updateOne(data, id);

    await this.getSessionOne();

    return team;
  }
}

export class TeamMemberModel extends TableModel<TeamMember, MemberFilter> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/member`;
  }

  restored = !isServer() && restore(this, 'TeamMember');

  @persist()
  @observable
  accessor currentOne = {} as TeamMember;

  @toggle('downloading')
  async getOne(id: number) {
    await this.restored;

    return this.currentOne.id === id ? this.currentOne : super.getOne(id);
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
}

export class TeamWorkModel extends TableModel<TeamWork, WorkFilter> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/work`;
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
