import { User } from '@authing/native-js-ui-components';
import { ListModel, NewData, Stream, toggle } from 'mobx-restful';

import { Base, createListStream, Media } from './Base';
import sessionStore from './Session';
import { Team } from './Team';

export interface Award extends Base {
  hackathonName: string;
  name: string;
  description: string;
  quantity: number;
  target: 'team' | 'individual';
  pictures: Media[];
}

export interface AwardAssignment
  extends Omit<Base, 'id'>,
    Omit<Award, 'name' | 'quantity' | 'target' | 'pictures'> {
  assignmentId: string;
  assigneeId: string;
  user?: User;
  team?: Team;
  awardId: string;
}

export class AwardModel extends Stream<Award>(ListModel) {
  client = sessionStore.client;
  currentAssignment?: AwardAssignmentModel;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/award`;
  }

  assignmentOf(tid = this.currentOne.id) {
    return (this.currentAssignment = new AwardAssignmentModel(
      `${this.baseURI}/${tid}`,
    ));
  }

  openStream() {
    return createListStream<Award>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async updateOne(data: NewData<Award>, id?: string) {
    const { body } = await (id
      ? this.client.patch<Award>(`${this.baseURI}/${id}`, data)
      : this.client.put<Award>(this.baseURI, data));

    return (this.currentOne = body!);
  }
}

export class AwardAssignmentModel extends Stream<AwardAssignment>(ListModel) {
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

  @toggle('uploading')
  async updateOne(data: NewData<AwardAssignment>, id?: string) {
    const { body } = await (id
      ? this.client.patch<AwardAssignment>(`${this.baseURI}/${id}`, data)
      : this.client.put<AwardAssignment>(this.baseURI, data));

    return (this.currentOne = body!);
  }
}
