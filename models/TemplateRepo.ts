import { IDType, ListModel, Stream, toggle } from 'mobx-restful';

import { Base, createListStream, InputData } from './Base';
import sessionStore from './Session';

export interface GitTemplate extends Base {
  url: string;
  isFetched: boolean;
  repoLanguages: {};
  repoTopics: string[];
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
  async updateOne(data: InputData<GitTemplate>) {
    const { body } = await this.client.put<GitTemplate>(
      `hackathon/${this.baseURI}/templateRepo`,
      data,
    );

    return (this.currentOne = body!);
  }

  @toggle('uploading')
  async deleteOne(templateRepoId: string) {
    await this.client.delete(`hackathon${this.baseURI}/${templateRepoId}`);
    await this.removeOne(templateRepoId);
  }
}
