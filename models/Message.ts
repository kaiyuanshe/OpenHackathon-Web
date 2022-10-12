import { observable } from 'mobx';
import { ListModel, Stream } from 'mobx-restful';
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

export class MessageModel extends Stream<Message,MessageFilter>(ListModel) {
  client = sessionStore.client;
  indexKey = "id" as const;

  @observable
  sessionOne?: Message;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}`;
  }

  openStream(filter: MessageFilter) {
    return createListStream<Message>(
      `${this.baseURI}/announcements`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}
