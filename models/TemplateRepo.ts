import { Base } from '@kaiyuanshe/openhackathon-service';
import { ListModel, Stream, toggle } from 'mobx-restful';

import { createListStream, InputData } from './Base';
import sessionStore from './User/Session';

export interface GitTemplate extends Base {
  url: string;
  isFetched: boolean;
  repoLanguages: Record<string, string>;
  repoTopics: string[];
  name?: string;
  default_branch?: string;
  description?: string;
}

export class GitTemplateModal extends Stream<GitTemplate>(ListModel) {
  client = sessionStore.client;

  constructor(public baseURI: string) {
    super();
  }

  openStream() {
    return createListStream<GitTemplate>(
      `${this.baseURI}/templateRepo`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async updateOne(data: InputData<GitTemplate>, id?: string) {
    const { body } = await (id
      ? this.client.patch<GitTemplate>(
          `${this.baseURI}/templateRepo/${id}`,
          data,
        )
      : this.client.put<GitTemplate>(`${this.baseURI}/templateRepo`, data));

    return (this.currentOne = body!);
  }

  @toggle('uploading')
  async deleteOne(templateRepoId: number) {
    await this.client.delete(`${this.baseURI}/templateRepo/${templateRepoId}`);
    await this.removeOne(templateRepoId);
  }
}
