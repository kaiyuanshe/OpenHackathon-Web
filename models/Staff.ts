import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { t } from 'i18next';
import { computed } from 'mobx';
import { ListModel, NewData, Stream, toggle } from 'mobx-restful';
import { groupBy, mergeStream } from 'web-utility';

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
    title: t('basic_settings'),
    list: [
      {
        title: t('edit_activity'),
        href: 'edit',
        icon: 'edit',
      },
      {
        title: t('sign_up_user'),
        href: 'participant',
        icon: 'user',
        list: [
          {
            title: t('registration_statistics'),
            href: 'participant/statistic',
          },
        ],
      },
      {
        title: t('admin'),
        href: 'administrator',
        icon: 'user-secret',
      },
      {
        title: t('prize_settings'),
        href: 'award',
        icon: 'trophy',
      },
      {
        title: t('join_activity_team'),
        href: 'team',
        icon: 'people-group',
        roles: ['judge'],
      },
      {
        title: 'works_awards',
        href: 'evaluation',
        icon: 'star',
      },
      {
        title: t('sponsor_information'),
        href: 'organization',
        icon: 'sitemap',
      },
      {
        title: t('announcement'),
        href: 'message',
        icon: 'bullhorn',
      },
      {
        title: t('log'),
        href: 'log',
        icon: 'message',
      },
    ],
  },
  {
    title: t('advance_settings'),
    list: [
      {
        title: t('cloud_resource'),
        href: 'git',
        icon: 'cloud',
      },
    ],
  },
];

export const activityTeamMenus: MenuItem[] = [
  {
    title: t('team_manage'),
    list: [
      // {
      //   title: '编辑信息',
      //   href: 'edit',
      //   icon: 'trophy',
      //   roles: ['admin']
      // },
      {
        title: t('team_registration'),
        href: 'participant',
        icon: 'user',
        roles: ['admin'],
      },
      {
        title: t('role_management'),
        href: 'role',
        icon: 'user-secret',
        roles: ['admin'],
      },
      {
        title: t('cloud_development_environment'),
        href: 'git',
        icon: 'cloud',
      },
    ],
  },
];

export interface Staff extends Base {
  type: 'admin' | 'judge' | 'member';
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
