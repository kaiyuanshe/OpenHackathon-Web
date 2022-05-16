import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { Base } from './Base';
import { User } from './User';

export interface MenuItem {
  title: string;
  href?: string;
  icon?: IconProp;
  list?: MenuItem[];
}

export const menus: MenuItem[] = [
  {
    title: '基础设置',
    list: [
      {
        title: '编辑活动',
        href: 'meta',
        icon: 'edit',
      },
      {
        title: '报名用户',
        href: 'participant',
        icon: 'user',
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

export interface AdminsJudges extends Base {
  hackathonName: string;
  userId: string;
  user: User;
  description?: string;
}
