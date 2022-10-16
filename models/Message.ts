import { observable } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { Base, createListStream, Filter } from './Base';
import sessionStore from './Session';

export interface Message extends Base {
  createdAt: string;
  updatedAt: string;
  hackathonName: string;
  id: string;
  title: string;
  content: string;
}

export type MessageFilter = Filter<Message>;

export class MessageModel extends Stream<Message, MessageFilter>(ListModel) {
  client = sessionStore.client;
  indexKey = "id" as const;

  @observable
  sessionOne?: Message;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/announcements`;
  }

  openStream(filter: MessageFilter) {
    return createListStream<Message>(
      `${this.baseURI}s?${buildURLData(filter)}`,
      this.client,
      count => (this.totalCount = count),
    );
  }


  @toggle('downloading')
  async getSessionOne() {
    const { body } = await this.client.get<Message>(this.baseURI);

    return (this.sessionOne = body!);
  }

  @toggle('uploading')
  async verifyOne(id: string) {
    await this.client.post(
      `${this.baseURI}/${id}`,
      {},
    );
    this.changeOne({}, id, true);
  }
}
