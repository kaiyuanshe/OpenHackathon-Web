import { observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';
import { HTTPClient } from 'koajax';

import { UploadUrl } from './Base';
import { AuthingUserBase, User } from './User';
import { uploadBlob } from '../pages/api/core';

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

  @toggle('uploading')
  async uploadFile(file: File) {
    const { type, name } = file;

    const { body } = await this.client.post<UploadUrl>(`user/generateFileUrl`, {
      filename: name,
    });
    await uploadBlob(body!.uploadUrl, 'PUT', file, { 'Content-Type': type });

    return body!.url;
  }
}

export default new SessionModel();
