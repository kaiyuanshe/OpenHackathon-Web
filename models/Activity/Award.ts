import { User } from '@authing/native-js-ui-components';
import { Base, Media } from '@kaiyuanshe/openhackathon-service';
import { ListModel, Stream, toggle } from 'mobx-restful';

import { createListStream, InputData } from '../Base';
import sessionStore from '../User/Session';
import { Team } from './Team';

export interface Award
  extends Record<'hackathonName' | 'name' | 'description', string>,
    Base {
  quantity: number;
  target: 'team' | 'individual';
  pictures: Media[];
}

export interface AwardAssignment
  extends Omit<Base, 'id'>,
    Omit<Award, 'name' | 'quantity' | 'target' | 'pictures'>,
    Record<'assignmentId' | 'assigneeId' | 'awardId', number> {
  user?: User;
  team?: Team;
  award: Award;
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
  async updateOne(data: InputData<Award>, id?: string) {
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
  async updateOne(data: InputData<AwardAssignment>, id?: string) {
    const { body } = await (id
      ? this.client.patch<AwardAssignment>(`${this.baseURI}/${id}`, data)
      : this.client.put<AwardAssignment>(this.baseURI, data));

    return (this.currentOne = body!);
  }
}
