import { ListModel, Stream } from 'mobx-restful';

import { Base, Media, createListStream } from './Base';
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
}
