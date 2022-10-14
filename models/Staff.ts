import { groupBy, mergeStream } from 'web-utility';
import { computed } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { Base, createListStream } from './Base';
import sessionStore from './Session';
import { User } from './User';

export interface MenuItem {
  title: string;
  href?: string;
  icon?: IconProp;
  list?: MenuItem[];
  roles?: Staff['type'][];
}

export const menus: MenuItem[] = [
  {
    title: '基础设置',
    list: [
      {
        title: '编辑活动',
        href: 'edit',
        icon: 'edit',
      },
      {
        title: '报名用户',
        href: 'participant',
        icon: 'user',
        list: [{ title: '报名统计', href: 'participant/statistic' }],
      },
      {
        title: '管理员',
        href: 'administrator',
        icon: 'user-secret',
      },
      {
        title: '奖项设置',
        href: 'award',
        icon: 'trophy',
      },
      {
        title: '参赛团队',
        href: 'team',
        icon: 'people-group',
        roles: ['judge'],
      },
      {
        title: '作品评奖',
        href: 'evaluation',
        icon: 'star',
      },
      {
        title: '主办方信息',
        href: 'organization',
        icon: 'sitemap',
      },
      {
        title: '公告',
        href: 'message',
        icon: 'bullhorn',
      },
    ],
  },
  {
    title: '高级设置',
    list: [
      {
        title: '云资源',
        href: 'cloud',
        icon: 'upload',
      },
      {
        title: '虚拟环境',
        href: 'virtualenv',
        icon: 'th-large',
      },
      {
        title: '环境监控',
        href: 'monitorenv',
        icon: 'desktop',
      },
    ],
  },
];

export interface Staff extends Base {
  type: 'admin' | 'judge';
  hackathonName: string;
  userId: string;
  user: User;
  description?: string;
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
    this.totalCount === Infinity
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
  async updateOne({ type, ...data }: NewData<Staff>, userId: string) {
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
