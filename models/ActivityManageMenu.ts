import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MenuHref {
  title: string;
  href: string;
  icon: IconProp;
}

export interface MenuList {
  title: string;
  list: MenuHref[];
}

export const menus: MenuList[] = [
  {
    title: '基础设置',
    list: [
      {
        title: '编辑活动',
        href: 'activity',
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
