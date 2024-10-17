import { t } from '../../models/Base/Translation';

export interface Organization {
  name: string;
  url: string;
  logo: string;
}

export enum OrganizationType {
  sponsor,
  host,
}

export const OrganizationTypeName = () => ({
  [OrganizationType.sponsor]: t('sponsors'),
  [OrganizationType.host]: t('partners'),
});

export const partner: () => Record<OrganizationType, Organization[]> = () => ({
  [OrganizationType.sponsor]: [
    {
      name: t('huaweicloud'),
      url: 'https://www.huaweicloud.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/huawei.png',
    },
    {
      name: t('microsoft'),
      url: 'https://www.microsoft.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/microsoft.png',
    },
    {
      name: t('authing'),
      url: 'https://authing.cn/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/authing.png',
    },
  ],
  [OrganizationType.host]: [
    {
      name: t('microsoft'),
      url: 'https://www.microsoft.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/microsoft.png',
    },
    {
      name: t('gitcafe'),
      url: 'https://gitcafe.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/gitcafe-small.png',
    },
    {
      name: t('ubuntukylin'),
      url: 'https://www.ubuntukylin.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/UbuntuKylinnew.png',
    },
    {
      name: t('alauda'),
      url: 'http://www.alauda.cn/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/alauda-small.png',
    },
    {
      name: t('jikexueyuan'),
      url: 'http://www.jikexueyuan.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/jikexueyuan.png',
    },
    {
      name: t('jstorm'),
      url: 'https://github.com/alibaba/jstorm/wiki',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/jstorm-small.png',
    },
    {
      name: t('wicresoft'),
      url: 'https://www.wicresoft.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/wicresoft-small.png',
    },
    {
      name: t('juhe'),
      url: 'https://www.juhe.cn/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/juhe.png',
    },
  ],
});
