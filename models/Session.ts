import { HTTPClient } from 'koajax';
import { computed, observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { AuthingIdentity, AuthingUserBase, User } from './User';

const { localStorage } = globalThis;

export class SessionModel extends BaseModel {
  @observable
  user?: User = localStorage?.user && JSON.parse(localStorage.user);

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

  constructor() {
    super();

    if (+new Date(this.user?.tokenExpiredAt || '') <= Date.now())
      this.signOut();
  }

  @toggle('uploading')
  async signIn(profile: AuthingUserBase) {
    const { body } = await this.client.post<User>('login', profile);

    localStorage.user = JSON.stringify(body);

    return (this.user = body);
  }

  signOut() {
    localStorage?.clear();

    this.user = undefined;
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
