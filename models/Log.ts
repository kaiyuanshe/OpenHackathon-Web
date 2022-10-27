import { IDType, ListModel, Stream } from 'mobx-restful';

import { Base, createListStream } from './Base';
import sessionStore from './Session';

export interface Log extends Base {
  operatorId: IDType;
  message: string;
  messageFormat: string;
  activityLogType: string;
}

export class LogModel extends Stream<Log>(ListModel) {
  client = sessionStore.client;
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${this.baseURI}/activityLogs`;
  }

  openStream() {
    return createListStream<Log>(
      this.baseURI,
      this.client,
      count => (this.totalCount = count),
    );
  }
}
