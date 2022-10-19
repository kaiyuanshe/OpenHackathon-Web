import { IDType, ListModel, NewData, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { Base, createListStream, Filter } from './Base';
import sessionStore from './Session';

export enum MessageType {
  Hackathon = 'hackathon',
}

export const MessageTypeName = {
  [MessageType.Hackathon]: '黑客松平台消息',
};

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

  @toggle('uploading')
  async updateOne(data: NewData<Message>, id?: IDType) {
    const { body } = await (id
      ? this.client.patch<Message>(`${this.baseURI}/${id}`, data)
      : this.client.put<Message>(this.baseURI, data));
    return (this.currentOne = body!);
  }
}
