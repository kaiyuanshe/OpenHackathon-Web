import { ListModel, Stream } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { Base, createListStream } from './Base';
import sessionStore from './Session';

export interface Notice extends Base {
    createdAt: string;
    updatedAt: string;
    hackathonName: string;
    id: string;
    title: string;
    content: string;
}

export class NoticeModel extends Stream<Notice>(ListModel) {
    client = sessionStore.client;
    baseURI = 'hackathon/foo/announcements';

    openStream({
    }) {
        return createListStream<Notice>(
          this.baseURI,
          this.client,
          count => (this.totalCount = count),
        );
      }
}

export default new NoticeModel();