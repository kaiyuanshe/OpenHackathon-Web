import { HTTPClient } from 'koajax';
import { computed, observable } from 'mobx';
import { parseCookie, setCookie } from 'mobx-i18n';
import { BaseModel, toggle } from 'mobx-restful';
import { buildURLData, sleep } from 'web-utility';

import { AuthingIdentity, AuthingUserBase, User } from '.';

const { localStorage, document } = globalThis;

const { token } = (document ? parseCookie() : {}) as { token: string };

export const strapiClient = new HTTPClient({
  baseURI: `${
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:1337'
      : 'https://hackathon-server.kaiyuanshe.cn'
  }/api/`,
  responseType: 'json',
}).use(({ request }, next) => {
  if (token)
    request.headers = { ...request.headers, Authorization: `Bearer ${token}` };

  return next();
});

export interface Base extends Record<'createdAt' | 'updatedAt', string> {
  id: number;
}

export interface SessionUser
  extends Base,
    Record<'username' | 'email', string>,
    Record<'confirmed' | 'blocked', boolean> {
  provider: 'local' | 'github';
  gender?: 'Female' | 'Male' | 'Other';
}

export class SessionModel extends BaseModel {
  constructor() {
    super();

    if (+new Date(this.user?.tokenExpiredAt || '') <= Date.now())
      this.signOut();
  }

  @observable
  accessor user: User | undefined =
    localStorage?.user && JSON.parse(localStorage.user);

  @computed
  get userOAuth() {
    const { oAuth } = this.user || {};

    return oAuth && JSON.parse(oAuth);
  }

  @computed
  get metaOAuth() {
    const { identities = [] } = this.user || {};

    return Object.fromEntries(
      identities.map(identity => [identity.provider, identity]),
    ) as Record<AuthingIdentity['provider'], AuthingIdentity>;
  }

  client = new HTTPClient({
    baseURI: process.env.NEXT_PUBLIC_API_HOST,
    responseType: 'json',
  }).use(({ request }, next) => {
    const { token } = this.user || {};

    if (token)
      request.headers = { ...request.headers, Authorization: `token ${token}` };

    return next();
  });

  @toggle('uploading')
  async signIn(profile: AuthingUserBase, reload = false) {
    const { body } = await this.client.post<User>('login', profile);

    setCookie('token', body!.token, { path: '/' });
    localStorage.user = JSON.stringify(body);

    if (reload) sleep().then(() => location.reload());

    return (this.user = body);
  }

  signOut(reload = false) {
    setCookie('token', '', { path: '/', expires: new Date() });
    localStorage?.clear();

    this.user = undefined;

    if (reload) location.reload();
  }

  exportURLOf(
    reportType: 'enrollments' | 'teams' | 'teamWorks',
    baseURI: string,
  ) {
    const { client, user } = this;

    return (
      new URL(
        `report?${buildURLData({ reportType, token: user?.token })}`,
        `${client.baseURI}${baseURI}`,
      ) + ''
    );
  }
}

export default new SessionModel();
