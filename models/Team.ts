import { ListModel, Stream } from 'mobx-restful';

import { Base, createListStream } from './Base';
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

export interface Team extends Base {
  hackathonName: string;
  id: string;
  displayName: string;
  description: string;
  autoApprove: boolean;
  creatorId: string;
  creator: User;
  membersCount: number;
}

export interface TeamWork extends Base {
  teamId: string;
  hackathonName: string;
  title: string;
  description: string;
  type: WorkTypeEnum;
  url: string;
}

export interface TeamMember extends Omit<Base, 'id'> {
  hackathonName: string;
  teamId: string;
  userId: string;
  user: User;
  description: string;
  role: string;
  status: MembershipStatusEnum;
}

export class TeamModel extends Stream<Team>(ListModel) {
  client = sessionStore.client;

  constructor(activity: string) {
    super();
    this.baseURI = `hackathon/${activity}/team`;
  }

  openStream() {
    return createListStream<Team>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}
