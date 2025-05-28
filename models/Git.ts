import 'array-unique-proposal';

import { GitTemplate } from '@kaiyuanshe/openhackathon-service';
import { components } from '@octokit/openapi-types';
import { githubClient, RepositoryFilter, RepositoryModel } from 'mobx-github';
import { toggle } from 'mobx-restful';

import { GITHUB_PAT } from '../configuration';
import { TeamWorkModel } from './Activity/Team';
import { TableModel } from './Base';
import sessionStore from './User/Session';

type Repository = components['schemas']['repository'];

githubClient.use(({ request }, next) => {
  const { accessToken = GITHUB_PAT } = sessionStore.metaOAuth.github || {};

  if (accessToken) request.headers = { ...request.headers, Authorization: `Bearer ${accessToken}` };

  return next();
});

export class GitModel extends TableModel<GitTemplate> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/git-template`;
  }

  @toggle('uploading')
  async createOneFrom(templateURI: string, name: string) {
    const { body } = await githubClient.post<Repository>(`repos/${templateURI}/generate`, { name });

    return body!;
  }

  @toggle('uploading')
  addCollaborator(URI: string, user: string) {
    return githubClient.put(`repos/${URI}/collaborators/${user}`);
  }
}

export class WorkspaceModel extends TeamWorkModel {
  constructor(baseURI: string) {
    super(baseURI);
    this.baseURI = `${baseURI}/work/git-repository`;
  }
}

export const SourceRepository = [
  ['kaiyuanshe/open-hackathon'],
  [
    'kaiyuanshe/OpenHackathon-Web',
    'kaiyuanshe/open-hackathon-api',
    'kaiyuanshe/open-hackathon-guacamole',
    'kaiyuanshe/cloudengine',
  ],
  [
    'kaiyuanshe/OpenHackathon-Web',
    'kaiyuanshe/OpenHackathon-service',
    'kaiyuanshe/OpenHackathon-server',
  ],
];

export class SourceRepositoryModel extends RepositoryModel {
  async loadPage(page: number, per_page: number, { relation }: RepositoryFilter) {
    const list = SourceRepository.flat()
      .uniqueBy()
      .slice((page - 1) * per_page, page * per_page);

    const pageData: Awaited<ReturnType<RepositoryModel['getOne']>>[] = [];

    for (const full_name of list) {
      const item = await this.getOne(full_name, relation);

      pageData.push(item);
    }
    return { pageData, totalCount: list.length };
  }
}
