import { ListModel, NewData, Stream, toggle } from 'mobx-restful';

import { Base, createListStream, Media } from './Base';
import sessionStore from './Session';

export interface Award extends Base {
  hackathonName: string;
  name: string;
  description: string;
  quantity: number;
  target: 'team' | 'individual';
  pictures: Media[];
}

export class AwardModel extends Stream<Award>(ListModel) {
  client = sessionStore.client;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/award`;
  }

  openStream() {
    return createListStream<Award>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async updateOne(data: NewData<Award>, id?: string) {
    const { body } = await (id
      ? this.client.patch<Award>(`${this.baseURI}/${id}`, data)
      : this.client.put<Award>(this.baseURI, data));

    return (this.currentOne = body!);
  }
}
