import { Enrollment, User } from '@kaiyuanshe/openhackathon-service';
import { computed, observable } from 'mobx';
import { Statistic, toggle } from 'mobx-restful';
import { buildURLData, countBy, groupBy } from 'web-utility';

import { createListStream, Filter, TableModel } from '../Base';
import { i18n } from '../Base/Translation';
import sessionStore from '../User/Session';

export const statusName = ({ t }: typeof i18n): Record<Enrollment['status'], string> => ({
  approved: t('approve'),
  rejected: t('status_rejected'),
  none: t('status_none'),
  pendingApproval: t('status_pending'),
});

export type EnrollmentFilter = Filter<Enrollment>;

export interface EnrollmentStatistic extends Statistic<Enrollment>, Statistic<Required<User>> {
  answers?: Record<string, Record<string, number>>;
}

export class EnrollmentModel extends TableModel<Enrollment, EnrollmentFilter> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/enrollment`;
  }

  @observable
  accessor sessionOne: Enrollment | undefined;
  // @ts-ignore
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
  async verifyOne(userId: number, status: Enrollment['status']) {
    await this.client.post(
      `${this.baseURI}/${userId}/${status === 'approved' ? 'approve' : 'reject'}`,
      {},
    );
    this.changeOne({ status }, userId, true);
  }

  async getStatistic() {
    await this.countAll(['status']);

    const { allItems } = this;

    const questionGroup = groupBy(allItems.map(({ form }) => form).flat(), ({ title }) => title);
    const answers = Object.fromEntries(
      Object.entries(questionGroup).map(([title, answers]) => {
        const { _, ...data } = countBy(answers, ({ content }) =>
          /https?:\/\//.test(content) ? '_' : content.split(','),
        );
        return [title, data];
      }),
    );
    const createdAt = countBy(allItems, ({ createdAt }) => createdAt.split('T')[0]);
    // const { _, ...city } = countBy(
    //   allItems,
    //   ({ createdBy: { city } }) => city?.split(/\W+/)[0] || '_',
    // );
    return (this.statistic = {
      ...this.statistic,
      createdAt,
      // city,
      answers,
    });
  }
}
