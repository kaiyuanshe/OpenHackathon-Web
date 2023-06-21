import { components } from '@octokit/openapi-types';
import { HTTPClient } from 'koajax';
import { memoize } from 'lodash';
import { BaseModel, ListModel, Stream, toggle } from 'mobx-restful';
import { averageOf } from 'web-utility';

import { Base, createListStream } from './Base';
import sessionStore from './Session';
import { TeamWork, TeamWorkType } from './Team';

type Repository = components['schemas']['repository'];

export interface GitRepository
  extends Base,
    Pick<
      Repository,
      | 'name'
      | 'full_name'
      | 'html_url'
      | 'is_template'
      | 'default_branch'
      | 'topics'
      | 'description'
      | 'homepage'
    > {
  languages?: string[];
}

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

const getGitRepository = memoize(
  async (URI: string): Promise<GitRepository> => {
    const { body } = await gitClient.get<Repository>(`repos/${URI}`);
    const {
      id,
      created_at,
      updated_at,
      name,
      full_name,
      html_url,
      is_template,
      default_branch,
      languages_url,
      topics,
      description,
      homepage,
    } = body!;

    const { body: languageCount } = await gitClient.get<Record<string, number>>(
      languages_url,
    );

    const languageAverage = averageOf(...Object.values(languageCount!));

    const languageList = Object.entries(languageCount!)
      .filter(([_, score]) => score >= languageAverage)
      .sort(([_, a], [__, b]) => b - a);

    return {
      id: id + '',
      createdAt: created_at || '',
      updatedAt: updated_at || '',
      name,
      full_name,
      html_url,
      is_template,
      default_branch,
      topics,
      languages: languageList.map(([name]) => name),
      description,
      homepage,
    };
  },
);

export class GitModel extends Stream<GitRepository>(ListModel) {
  baseURI = 'repos';
  client = gitClient;

  @toggle('downloading')
  async getOne(URI: string) {
    return (this.currentOne = await getGitRepository(URI));
  }

  async *openStream() {
    this.totalCount = DefaultTemplates.length;

    for (const link of DefaultTemplates) {
      const { pathname } = new URL(link);

      yield await this.getOne(pathname.slice(1));
    }
  }

  @toggle('uploading')
  async createOneFrom(templateURI: string, name: string) {
    const { body } = await this.client.post<Repository>(
      `${this.baseURI}/${templateURI}/generate`,
      { name },
    );
    return body!;
  }

  @toggle('uploading')
  addCollaborator(URI: string, user: string) {
    return this.client.put(`${this.baseURI}/${URI}/collaborators/${user}`);
  }
}

const DefaultTemplates = [
  'https://github.com/idea2app/React-MobX-Bootstrap-ts',
  'https://github.com/idea2app/React-MobX-Ant-Design-ts',
  'https://github.com/idea2app/Vue-Bootstrap-ts',
  'https://github.com/idea2app/Next-Bootstrap-ts',
  'https://github.com/idea2app/REST-Node-ts',
  'https://github.com/idea2app/NodeTS-LeanCloud',
  'https://github.com/idea2app/Taro-Vant-MobX-ts',
  'https://github.com/idea2app/Vue3-Taro-Vant-ts',
  'https://github.com/idea2app/uniapp-uview-ts',
  'https://github.com/idea2app/Kotlin-Spring-Boot',
  'https://github.com/idea2app/ThinkPHP-scaffold',
];

export class WorkspaceModel extends GitModel {
  client = sessionStore.client;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/work`;
  }

  async *openStream() {
    var dropCount = 0;

    for await (const { type, url } of createListStream<TeamWork>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count - dropCount),
    )) {
      const { origin, pathname } = new URL(url);

      if (type !== TeamWorkType.WEBSITE || origin !== 'https://github.com')
        dropCount++;
      else {
        yield await getGitRepository(pathname.slice(1));
      }
    }
  }
}
