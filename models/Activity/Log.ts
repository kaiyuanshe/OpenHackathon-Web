import { IDType, Stream } from 'mobx-restful';
import { StrapiListModel } from 'mobx-strapi';

import { Base, createListStream } from '../Base';
import sessionStore, { strapiClient } from '../User/Session';

export interface Log extends Base {
  operatorId: IDType;
  message: string;
  messageFormat: string;
  activityLogType: string;
}

export class LogModel extends Stream<Log>(StrapiListModel) {
  client = strapiClient;

  constructor(baseURI: string) {
    super();
    this.baseURI = `${baseURI}/activityLogs`;
  }

  openStream() {
    return createListStream<Log>(
      this.baseURI,
      this.client,
      count => (this.totalCount = count),
    );
  }
}
