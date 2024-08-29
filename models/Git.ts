import { GitTemplate } from '@kaiyuanshe/openhackathon-service';
import { components } from '@octokit/openapi-types';
import { HTTPClient } from 'koajax';
import { toggle } from 'mobx-restful';

import { TeamWorkModel } from './Activity/Team';
import { TableModel } from './Base';
import sessionStore from './User/Session';

type Repository = components['schemas']['repository'];

const gitClient = new HTTPClient({
  baseURI: 'https://api.github.com/',
  responseType: 'json',
}).use(({ request }, next) => {
  const { accessToken } = sessionStore.metaOAuth.github || {};

  if (accessToken)
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  return next();
});

export class GitModel extends TableModel<GitTemplate> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/git-template`;
  }

  @toggle('uploading')
  async createOneFrom(templateURI: string, name: string) {
    const { body } = await gitClient.post<Repository>(
      `repos/${templateURI}/generate`,
      { name },
    );
    return body!;
  }

  @toggle('uploading')
  addCollaborator(URI: string, user: string) {
    return gitClient.put(`repos/${URI}/collaborators/${user}`);
  }
}

export class WorkspaceModel extends TeamWorkModel {
  constructor(baseURI: string) {
    super(baseURI);
    this.baseURI = `${baseURI}/work/git-repository`;
  }
}
