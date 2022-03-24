export interface Organization {
  name: string;
  url: string;
  logo: string;
}

export enum OrganizationType {
  sponsor,
  host,
}

export const OrganizationTypeName = {
  [OrganizationType.sponsor]: '赞助伙伴',
  [OrganizationType.host]: '合作主办',
};

export const partner: Record<OrganizationType, Organization[]> = {
  [OrganizationType.sponsor]: [
    {
      name: '华为云',
      url: 'https://www.huaweicloud.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/huawei.png',
    },
    {
      name: '微软',
      url: 'https://www.microsoft.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/microsoft.png',
    },
    {
      name: 'Authing',
      url: 'https://authing.cn/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/authing.png',
    },
  ],
  [OrganizationType.host]: [
    {
      name: '微软',
      url: 'https://www.microsoft.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/microsoft.png',
    },
    {
      name: 'Gitcafe',
      url: 'https://gitcafe.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/gitcafe-small.png',
    },
    {
      name: '优麒麟',
      url: 'https://www.ubuntukylin.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/UbuntuKylinnew.png',
    },
    {
      name: '灵雀云',
      url: 'http://www.alauda.cn/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/alauda-small.png',
    },
    {
      name: '极客学院',
      url: 'http://www.jikexueyuan.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/jikexueyuan.png',
    },
    {
      name: 'JStorm',
      url: 'https://github.com/alibaba/jstorm/wiki',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/jstorm-small.png',
    },
    {
      name: '微创科技',
      url: 'https://www.wicresoft.com/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/wicresoft-small.png',
    },
    {
      name: '聚合数据',
      url: 'https://www.juhe.cn/',
      logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/juhe.png',
    },
  ],
};
