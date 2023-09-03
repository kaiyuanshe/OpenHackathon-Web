import { computed } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';
import { groupBy, mergeStream } from 'web-utility';

import { Base, createListStream, InputData } from '../Base';
import { User } from '../User';
import sessionStore from '../User/Session';

export interface HackathonAdmin
  extends Base,
    Record<'hackathonName' | 'description' | 'userId', string> {
  user: User;
}

export interface Staff extends HackathonAdmin {
  type: 'admin' | 'judge' | 'member';
}

export class StaffModel extends Stream<Staff>(ListModel) {
  client = sessionStore.client;
  indexKey = 'userId' as const;

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

  addCount = (count = 0) =>
    this.totalCount === undefined || this.totalCount === Infinity
      ? (this.totalCount = count)
      : (this.totalCount += count);

  openStream() {
    return mergeStream<Staff, void, undefined>(
      async function* (this: StaffModel) {
        for await (const item of createListStream<Staff>(
          `${this.baseURI}/admins`,
          this.client,
          this.addCount,
        ))
          yield { ...item, type: 'admin' as const };
      }.bind(this),
      async function* (this: StaffModel) {
        for await (const item of createListStream<Staff>(
          `${this.baseURI}/judges`,
          this.client,
          this.addCount,
        ))
          yield { ...item, type: 'judge' as const };
      }.bind(this),
    );
  }

  @toggle('uploading')
  async updateOne({ type, ...data }: InputData<Staff>, userId: string) {
    const { body } = await this.client.put<Staff>(
      `${this.baseURI}/${type}/${userId}`,
      data,
    );
    const index = this.indexOf(userId);

    if (index > -1) this.changeOne(body!, userId);

    return body!;
  }

  @toggle('uploading')
  async deleteOne(userId: string) {
    const { type } =
      this.allItems.find(({ userId: id }) => id === userId) || {};

    if (!type) return;

    await this.client.delete(`${this.baseURI}/${type}/${userId}`);

    await this.removeOne(userId);
  }
}
