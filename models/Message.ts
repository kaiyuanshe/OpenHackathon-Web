import { ListModel, Stream } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { Base, createListStream, Filter } from './Base';
import sessionStore from './Session';

export interface Message extends Base {
  hackathonName: string;
  title: string;
  content: string;
}

export type MessageFilter = Filter<Message>;

export class MessageModel extends Stream<Message, MessageFilter>(ListModel) {
  client = sessionStore.client;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/announcement`;
  }

  openStream(filter: MessageFilter) {
    return createListStream<Message>(
      `${this.baseURI}s?${buildURLData(filter)}`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}
