import { observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';
import { HTTPClient } from 'koajax';

import { AuthingUserBase, User } from './User';

const { localStorage } = globalThis;

export class SessionModel extends BaseModel {
  @observable
  user?: User = localStorage?.user && JSON.parse(localStorage.user);

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
  async signIn(profile: AuthingUserBase) {
    const { body } = await this.client.post<User>('login', profile);

    localStorage.user = JSON.stringify(body);

    return (this.user = body);
  }

  signOut() {
    localStorage?.clear();

    this.user = undefined;
  }
}

export default new SessionModel();
