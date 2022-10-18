import { components } from '@octokit/openapi-types';
import { HTTPClient } from 'koajax';
import { memoize } from 'lodash';
import { ListModel, Stream, toggle } from 'mobx-restful';
import { averageOf } from 'web-utility';

import { Base } from './Base';
import sessionStore from './Session';

type Repository = components['schemas']['repository'];

export interface GitRepository
  extends Base,
    Pick<Repository, 'name' | 'full_name' | 'url' | 'is_template' | 'topics'> {
  languages?: string[];
}

export class GitModel extends Stream<GitRepository>(ListModel) {
  baseURI = 'repos';

  client = new HTTPClient({
    baseURI: 'https://api.github.com/',
    responseType: 'json',
  }).use(({ request }, next) => {
    const token = sessionStore.user?.identities?.[0].accessToken;

    if (token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
    return next();
  });

  getOne = memoize(async (URI: string): Promise<GitRepository> => {
    const { body } = await this.client.get<Repository>(
      `${this.baseURI}/${URI}`,
    );
    const {
      node_id,
      created_at,
      updated_at,
      name,
      full_name,
      url,
      is_template,
      languages_url,
      topics,
    } = body!;

    const { body: languageCount } = await this.client.get<
      Record<string, number>
    >(languages_url);

    const languageAverage = averageOf(...Object.values(languageCount!));

    const languageList = Object.entries(languageCount!)
      .filter(([_, score]) => score >= languageAverage)
      .sort(([_, a], [__, b]) => b - a);

    return (this.currentOne = {
      id: node_id,
      createdAt: created_at || '',
      updatedAt: updated_at || '',
      name,
      full_name,
      url,
      is_template,
      topics,
      languages: languageList.map(([name]) => name),
    });
  });

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
