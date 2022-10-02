import { buildURLData } from 'web-utility';
import { observable, computed } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';

import { Base, Filter, createListStream } from './Base';
import { User } from './User';
import sessionStore from './Session';

export interface Enrollment extends Base {
  hackathonName: string;
  userId: string;
  user: User;
  status: 'none' | 'pendingApproval' | 'approved' | 'rejected';
  extensions: Record<'name' | 'value', string>[];
}

export type EnrollmentFilter = Filter<Enrollment>;

export class EnrollmentModel extends Stream<Enrollment, EnrollmentFilter>(
  ListModel,
) {
  client = sessionStore.client;
  indexKey = 'userId' as const;

  @observable
  sessionOne?: Enrollment;

  @computed
  get exportURL() {
    return sessionStore.exportURLOf('enrollments', this.baseURI);
  }

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/enrollment`;
  }

  openStream(filter: EnrollmentFilter) {
    return createListStream<Enrollment>(
      `${this.baseURI}s?${buildURLData(filter)}`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('downloading')
  async getSessionOne() {
    const { body } = await this.client.get<Enrollment>(this.baseURI);

    return (this.sessionOne = body!);
  }

  @toggle('uploading')
  async verifyOne(userId: string, status: Enrollment['status']) {
    await this.client.post(
      `${this.baseURI}/${userId}/${
        status === 'approved' ? 'approve' : 'reject'
      }`,
      {},
    );
    this.changeOne({ status }, userId, true);
  }
}
