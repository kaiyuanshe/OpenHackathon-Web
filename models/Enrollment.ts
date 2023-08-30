import { computed, makeObservable, observable } from 'mobx';
import { ListModel, Statistic, Stream, toggle } from 'mobx-restful';
import { buildURLData, countBy, groupBy } from 'web-utility';

import { i18n } from '../models/Translation';
import { Base, createListStream, Filter } from './Base';
import sessionStore from './Session';
import { User } from './User';

const { t } = i18n;

export interface Enrollment extends Base {
  hackathonName: string;
  userId: string;
  user: User;
  status: 'none' | 'pendingApproval' | 'approved' | 'rejected';
  extensions: Record<'name' | 'value', string>[];
}
export const statusName: Record<Enrollment['status'], string> = {
  approved: t('approve'),
  rejected: t('status_rejected'),
  none: t('status_none'),
  pendingApproval: t('status_pending'),
};

export type EnrollmentFilter = Filter<Enrollment>;

export interface EnrollmentStatistic
  extends Statistic<Enrollment>,
    Statistic<Required<User>> {
  extensions?: Record<string, Record<string, number>>;
}

export class EnrollmentModel extends Stream<Enrollment, EnrollmentFilter>(
  ListModel,
) {
  constructor(baseURI: string) {
    super();
    makeObservable(this);

    this.baseURI = `${baseURI}/enrollment`;
  }

  client = sessionStore.client;
  indexKey = 'userId' as const;

  @observable
  sessionOne?: Enrollment = undefined;

  declare statistic: EnrollmentStatistic;

  @computed
  get exportURL() {
    return sessionStore.exportURLOf('enrollments', this.baseURI);
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

  async getStatistic() {
    await this.countAll(['status']);

    const { allItems } = this;

    const questionGroup = groupBy(
      allItems.map(({ extensions }) => extensions).flat(),
      ({ name }) => name,
    );
    const extensions = Object.fromEntries(
      Object.entries(questionGroup).map(([title, answers]) => {
        const { _, ...data } = countBy(answers, ({ value }) =>
          /https?:\/\//.test(value) ? '_' : value.split(','),
        );
        return [title, data];
      }),
    );
    const createdAt = countBy(
      allItems,
      ({ createdAt }) => createdAt.split('T')[0],
    );
    const { _, ...city } = countBy(
      allItems,
      ({ user: { city } }) => city?.split(/\W+/)[0] || '_',
    );
    return (this.statistic = {
      ...this.statistic,
      createdAt,
      city,
      extensions,
    });
  }
}
