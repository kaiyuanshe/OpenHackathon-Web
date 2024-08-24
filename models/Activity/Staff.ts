import { Staff } from '@kaiyuanshe/openhackathon-service';
import { computed } from 'mobx';
import { toggle } from 'mobx-restful';
import { groupBy } from 'web-utility';

import { InputData, TableModel } from '../Base';

export class StaffModel extends TableModel<Staff> {
  constructor(public baseURI: string) {
    super();
  }

  @computed
  get typeCount() {
    return Object.fromEntries(
      Object.entries(groupBy(this.allItems, 'type')).map(
        ([type, { length }]) => [type, length],
      ),
    ) as Record<Staff['type'], number>;
  }

  @toggle('uploading')
  async updateOne({ type, ...data }: InputData<Staff>, userId: number) {
    const { body } = await this.client.put<Staff>(
      `${this.baseURI}/${type}/${userId}`,
      data,
    );
    const index = this.indexOf(userId);

    if (index > -1) this.changeOne(body!, userId);

    return body!;
  }

  @toggle('uploading')
  async deleteOne(userId: number) {
    const { type } =
      this.allItems.find(({ user: { id } }) => id === userId) || {};

    if (!type) return;

    await this.client.delete(`${this.baseURI}/${type}/${userId}`);

    await this.removeOne(userId);
  }
}
