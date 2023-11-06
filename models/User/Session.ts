import { HTTPClient } from 'koajax';
import { computed, makeObservable, observable } from 'mobx';
import { setCookie } from 'mobx-i18n';
import { BaseModel, toggle } from 'mobx-restful';
import { buildURLData, sleep } from 'web-utility';

import { AuthingIdentity, AuthingUserBase, User } from '.';

const { localStorage } = globalThis;

export class SessionModel extends BaseModel {
  constructor() {
    super();
    makeObservable(this);

    if (+new Date(this.user?.tokenExpiredAt || '') <= Date.now())
      this.signOut();
  }

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
