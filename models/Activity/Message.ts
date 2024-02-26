import { IDType, ListModel, Stream, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { Base, createListStream, Filter, InputData } from '../Base';
import { i18n } from '../Base/Translation';
import sessionStore, { strapiClient } from '../User/Session';

const { t } = i18n;

export enum MessageType {
  Hackathon = 'hackathon',
}

export const MessageTypeName = () => ({
  [MessageType.Hackathon]: t('hackathon_message'),
});

export interface Message extends Base {
  title: string;
  content: string;
}

export type MessageFilter = Filter<Message>;

export class MessageModel extends Stream<Message, MessageFilter>(ListModel) {
  client = strapiClient;

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
  async updateOne(data: InputData<Message>, id?: IDType) {
    const { body } = await (id
      ? this.client.patch<Message>(`${this.baseURI}/${id}`, data)
      : this.client.put<Message>(this.baseURI, data));
    return (this.currentOne = body!);
  }
}
